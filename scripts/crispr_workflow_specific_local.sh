#!/bin/bash
# unset HTTP_PROXY
# unset HTTPS_PROXY
# pam="NGG"
# CRISPR_TOOL_SCRIPT_PATH="../crispr/bin"
# URL_CRISPR="http://localhost:2345"
# sl="20"
# fileSet="../crispr/test/data/sg/output_c.txt"
# gi="Enterobacter sp. 638 GCF_000016325.1&Candidatus Blochmannia vafer str. BVAF GCF_000185985.2"
# gni=""
# rfg="../reference_genomes_pickle/"
# URL_TAXON="http://localhost:5984/taxon_db_size"
# URL_TREE="http://localhost:5984/taxon_tree_db"
# fileBlast="../crispr/test/data/sg/blast.xml"
# pid=70

export PATH=$PATH:/data1/cecile/app/crispr-set/
source /data1/cecile/python_venv/cstb/bin/activate
CRISPR_TOOLS_SCRIPT_PATH=/data1/cecile/python_venv/cstb/CSTB/bin
export PYTHONPATH=/data1/cecile/python_venv/cstb/CSTB/lib
source /home/chilpert/miniconda3/etc/profile.d/conda.sh
conda activate new_blast

run_index_sequence() {
    queryFasta="query.fasta"
    printf ">query\n$seq\n" > $queryFasta
    queryIndex="query.index"
    echo python -u $CRISPR_TOOLS_SCRIPT_PATH/index_sequence.py -f $queryFasta -o $queryIndex > index_query.cmd
    python -u $CRISPR_TOOLS_SCRIPT_PATH/index_sequence.py -f $queryFasta -o $queryIndex 1> index_query.out 2> index_query.err
}

run_setCompare() {
    if [[ -s query.index ]]; then
        slFlag=""
        if [ "$sl" != "20" ]; then
            ((_sl = $sl + 3))
            slFlag="-c ${_sl}"
        fi
        fileSet="set_index.txt"
        echo setCompare $slFlag -i "$gi" -o "$gni" -l $rfg -e index -f $fileSet -s $queryIndex > setCompare.cmd
        setCompare $slFlag -i "$gi" -o "$gni" -l $rfg -e index -f $fileSet -s $queryIndex 2> ./setCompare.err 1> ./setCompare.log
    fi
}

run_blast() {
    if [[ -s $fileSet ]]; then
        blastOutput="blast_output.xml"
        echo blastn -outfmt 5 -query $queryFasta -db $blastdb > blast.cmd
        blastn -outfmt 5 -query $queryFasta -db $blastdb > $blastOutput 2> blast.err
    fi
}

run_post_processing(){
    if [[ -s $fileSet ]]; then
        loc=$(pwd | perl -ne '@tmp = split(/\//, $_); print "$tmp[$#tmp]";');
        echo python -u $CRISPR_TOOLS_SCRIPT_PATH/post_processing.py --include "$gi" --exclude "$gni" --couch_endpoint "$COUCH_ENDPOINT" --taxon_db "$NAME_TAXON" --genome_db "$NAME_GENOME" --set_compare set_index.txt --length "$sl" --motif_broker_endpoint "$MOTIF_BROKER_ENDPOINT" --tag "$loc" --blast $blastOutput --p_id $pid > post_processing.cmd
        python -u $CRISPR_TOOLS_SCRIPT_PATH/post_processing.py --include "$gi" --exclude "$gni" --couch_endpoint "$COUCH_ENDPOINT" --taxon_db "$NAME_TAXON" --genome_db "$NAME_GENOME" --set_compare set_index.txt --length "$sl" --motif_broker_endpoint "$MOTIF_BROKER_ENDPOINT" --tag "$loc" --blast $blastOutput --p_id $pid 2> post_processing.err
    fi
}

error_json () {
    msg=$1
    echo "{\"error\": \"$1\"}"
}

empty_json() {
    msg=$1
    echo "{\"emptySearch\": \"$1\"}"
}

#Search and index sgRNA in gene
run_index_sequence
if [[ -s index_query.err ]]; then
    error_json "Error while index gene - job $loc. Contact support with this job number : cstb-support@ibcp.fr"
else
    run_setCompare
    if [[ -s setCompare.err ]]; then
        msg=$(cat setCompare.err)
        if [[ $msg == "intersect size is zero"* ]]; then
            empty_json "No hits found"
        else
            error_json "Error while setCompare - job $loc. Contact support with this job number : cstb-support@ibcp.fr"
        fi
    else
        run_blast
        if [[ -s blast.err ]]; then
            error_json "Blast error - job $loc. Contact support with this job number : cstb-support@ibcp.fr"
        else
            run_post_processing
        fi
    fi
   
fi

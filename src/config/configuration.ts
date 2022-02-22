import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config_local.yaml';
export const TWIG_TEMPLATE = join(__dirname, '../../templates/')

export default () => {
    return yaml.load(
        readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
    ) as Record<string, any>;
};
import cloneDeep from 'lodash-es/cloneDeep';
// import {filter} from 'bluebird';

const filters = [
    {
        name: 'disease',
        color: ['#990000'],
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => {
                return (variant.association && variant.association.some(d => d.disease)) || (variant.clinicalSignificances && variant.clinicalSignificances === 'disease')
            }));
            return filteredData;
        }
    }, {
        name: 'predicted',
        color: [
            '#002594', '#8FE3FF'
        ],
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.sourceType === 'large_scale_study'));
            return filteredData;
        }
    }, {
        name: 'nonDisease',
        color: ['#99cc00'],
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => {
                return (variant.association && variant.association.some(d => !d.disease)) || (variant.clinicalSignificances && variant.clinicalSignificances === 'likely benign')
            }));
            return filteredData;
        }
    }, {
        name: 'uncertain',
        color: '#FFCC00',
        applyFilter: data => {}
    }, {
        name: 'UniProt',
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.sourceType === 'uniprot' || variant.sourceType === 'mixed'));
            return filteredData;
        }
    }, {
        name: 'ClinVar',
        applyFilter: data => {
            // TODO Waiting for data service model change to check variant.sourceType ===
            // clinVar'
        }
    }, {
        name: 'LSS',
        applyFilter: data => {
            const filteredData = cloneDeep(data);
            filteredData.forEach(variants => variants.variants = variants.variants.filter(variant => variant.sourceType === 'large_scale_study' || variant.sourceType === 'mixed'));
            return filteredData;
        }
    }
];

function getFiltersFromAttribute(attrValue) {
    if (attrValue) {
        const filterStrings = attrValue.split(',');
        return filters.filter(f => filterStrings.find(d => d === f.name));
    } else {
        return;
    }
}

export {getFiltersFromAttribute};
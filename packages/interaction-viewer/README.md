# interaction-viewer
http://ebi-uniprot.github.io/interaction-viewer/
An adjacency graph visualisation of protein interaction data, which makes use of the UniProt SPARQL endpoint http://sparql.uniprot.org/

# Installing
Once you have https://nodejs.org/ installed, run:
```
npm install
```

## Running locally
 - ```npm run watch``` whatches files for changes and automatically builds the application
 - ```npm run browsersync``` runs a local webserver to serve the application

## Publishing the application to github pages
```npm run deploy``` 
builds the application and pushes it to http://ebi-uniprot.github.io/interaction-viewer/

# Usage
```html
<interaction-viewer accession="A8BBG3"></interaction-viewer>
```

# API
You can change the accession on the fly by changing the attribute 'accession':
```javascript
document.querySelector("interaction-viewer").setAttribute('accession', accession);
```

# Dependencies
All dependencies are handled by npm

https://d3js.org/

http://webcomponents.org/polyfills/

# Contact
For support contact help@uniprot.org and please put interaction viewer in the subject line.

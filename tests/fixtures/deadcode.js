const TEST = false;
if (TEST) {
    console.log('Remove me in prod');
}

if ('node' === 'web') {
    console.log('Remove this because statically false!');
}

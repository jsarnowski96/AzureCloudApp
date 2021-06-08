const { BlobServiceClient, ContainerClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

var blobServiceClient;

async function init() {
    console.log('Azure Storage Service - initiating...');
    blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_CS);
}

// CONTAINERS

async function createContainer(containerName) {
    console.log('Creating container...');

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const container = await containerClient.create();

    //console.log("Container was created successfully. requestId: ", createContainerRes.requestId);
    isExist = container.exists();
    if(!isExist) {
        console.log('CREATE CONTAINER: FAIL');
        return false;
    } else {
        console.log('CREATE CONTAINER: DONE');
        return true;
    }
}

async function getContainer(containerName) {
    if(!containerName) {
        throw new Error('Container name field empty');
    }

    const container = await blobServiceClient.getContainerClient(containerName);    

    isExist = container.exists();
    if(!isExist) {
        console.log('GET CONTAINER: FAIL');
        return false;
    } else {
        console.log('GET CONTAINER: DONE');
        return true;
    }
}

async function deleteContainer(containerName) {
    if(!containerName) {
        throw new Error('Container name field empty');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log('DELETE CONTAINER: DONE');
    return await containerClient.delete();
}

// BLOBS

async function createBlob(containerName, file) {
    if(!containerName || !file) {
        throw new Error('Container or file field empty');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blob = await containerClient.getBlockBlobClient(file.name).uploadFile('./src/routes', file.size);
    blob.crea

    isExist = blob.exists();
    if(!isExist) {
        console.log('CREATE BLOB: FAIL');
        return false;
    } else {
        console.log('CREATE BLOB: DONE');
        return true;
    }
}

async function getBlob(containerName, blobName) {
    if(!containerName || !blobName) {
        throw new Error('Container or blob name field empty');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blob = await containerClient.getBlockBlobClient(blobName);

    isExist = blob.exists();
    if(!isExist) {
        console.log('GET BLOB: FAIL');
        return false;
    } else {
        console.log('GET BLOB: DONE');
        return true;
    }
}

async function deleteBlob(containerName, blobName) {
    if(!containerName || !blobName) {
        throw new Error('Container or blob name field empty');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log('DELETE BLOB: DONE');
    return await containerClient.getBlobBygetBlockBlobClientName(blobName).deleteBlob();
}

// EXPORTS

exports.init = init;
exports.createContainer = createContainer;
exports.getContainer = getContainer;
exports.deleteContainer = deleteContainer;
exports.createBlob = createBlob;
exports.getBlob = getBlob;
exports.deleteBlob = deleteBlob;

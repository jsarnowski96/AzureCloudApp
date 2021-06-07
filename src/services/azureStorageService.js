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
    const createContainerRes = await containerClient.create();

    console.log('CREATE CONTAINER: DONE');
    //console.log("Container was created successfully. requestId: ", createContainerRes.requestId);
    return "DONE";
}

async function getContainer(containerName) {
    if(!containerName) {
        throw new Error('Container name field empty');
    }

    console.log('GET CONTAINER: DONE');
    return await blobServiceClient.getContainerClient(containerName);    
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
    console.log('CREATE BLOB: DONE');
    return await containerClient.getBlockBlobClient(file.name).upload(file, file.size);
}

async function getBlob(containerName, blobName) {
    if(!containerName || !blobName) {
        throw new Error('Container or blob name field empty');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log('GET BLOB: DONE');
    return await containerClient.getBlockBlobClient(blobName);
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

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname+'/Route.proto';
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const UsersGRPC = protoDescriptor.Users;

// const client = new grpc.Client('localhost:50051',grpc.credentials.createInsecure());

module.exports = class UsersGateway {
    constructor() {
        this.grpcClient = new UsersGRPC.Users('localhost:50052',grpc.credentials.createInsecure());
    }
};


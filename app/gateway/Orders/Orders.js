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
const OrdersGRPC = protoDescriptor.Orders;

let client = new OrdersGRPC.Orders('localhost:50051',grpc.credentials.createInsecure());

module.exports = class OrdersGateway {
    constructor() {
        this.grpcClient = client
    }
};


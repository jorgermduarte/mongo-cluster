function initiateReplicaSet() {
    try {
        var config = {
            _id: "rs0",
            members: [
                { _id: 0, host: "mongo-secondary-1:27017" },
                { _id: 1, host: "mongo-secondary-2:27017" },
                { _id: 2, host: "mongo-primary:27017" }
            ]
        };

        rs.initiate(config);
        print("Replica set configuration initiated successfully.");
    } catch (error) {
        print("Error initiating replica set configuration:", error);
    }
}

function waitForConnection(host) {
    try {
        var maxAttempts = 10;
        var attempts = 0;

        while (attempts < maxAttempts) {
            try {
                var connection = new Mongo(host);
                connection.getDB("admin"); // Test the connection
                connection.close();
                print("Connected to", host);
                return;
            } catch (error) {
                attempts++;
                sleep(2000);
            }
        }
        print("Failed to connect to", host);
    } catch (error) {
        print("Error while waiting for connection:", error);
    }
}

waitForConnection("mongo-primary:27017");
initiateReplicaSet();

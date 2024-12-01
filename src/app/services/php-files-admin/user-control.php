<?php
// Database connection (you can use PDO or MySQLi for this example)

include 'connection.php';
// Get the POST data (assuming it's in JSON format)
$data = json_decode(file_get_contents('php://input'), true);

// Ensure data is valid
if (isset($data['userId']) && isset($data['permission']) && isset($data['value'])) {
    $userId = $data['userId'];
    $permission = $data['permission'];
    $value = $data['value'];

    // Map permission name to the correct column in the database
    $columnMap = [
        'events' => 'access_permissions_events',
        'transactions' => 'access_permissions_transactions',
        'reports' => 'access_permissions_reports',
        'user_settings' => 'access_permissions_user_settings',
        'access_control' => 'access_permissions_access_control',
        'history' => 'access_permissions_history'
    ];

    // Check if the permission is valid
    if (isset($columnMap[$permission])) {
        $column = $columnMap[$permission];

        // Update the user’s permission in the database
        $sql = "UPDATE tbl_users SET $column = ? WHERE user_info_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $value, $userId); // Assuming the value is an integer (1 or 0)
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Permission updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update permission"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid permission"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}

$conn->close();
?>
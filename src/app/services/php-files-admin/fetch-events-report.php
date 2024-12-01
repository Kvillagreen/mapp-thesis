<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Database connection
include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

$eventId = $data['eventId'] ?? 1;

if (!$eventId) {
    echo json_encode(['success' => false, 'message' => 'Event ID is required.']);
    exit();
}

try {
    // Updated SQL query to fetch data
    $sql = "
        SELECT 
            
           kiosk_name, 
           kiosk_description, 
            kiosk_image, 
            status AS kiosk_status, 
            position_x, 
            position_y
        FROM tbl_kiosk
        WHERE 
            event_id = ?
    ";

    // Prepare and execute the statement
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $eventId);
    $stmt->execute();

    // Fetch the result
    $result = $stmt->get_result();
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Send response
    echo json_encode($data);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching data.', 'error' => $e->getMessage()]);
}

// Close the connection
$conn->close();
?>
<?php
include 'connection.php';


$data = json_decode(file_get_contents("php://input"), true);

$eventId = $data['eventId'] ?? '';

try {
    // Prepare and execute SQL query securely using prepared statements
    $sql = "SELECT kiosk_id, kiosk_name, status, kiosk_description, kiosk_image, position_x, position_y, transform, date_created
            FROM tbl_kiosk WHERE event_id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("SQL prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $eventId);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Return JSON response
// Return JSON response
    header('Content-Type: application/json');
    echo json_encode($data);

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    // Handle errors
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
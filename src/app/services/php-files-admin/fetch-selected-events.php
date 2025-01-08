<?php
include 'connection.php';

// Set the content type to JSON
header('Content-Type: application/json');

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Extract event ID from input, default to '1' if not provided
$eventId = $data['eventId'] ?? 1;
    // Prepare the SQL query
    $sql = $conn->prepare("SELECT status, event_name, event_start, event_end, details, event_image, date_created 
                           FROM tbl_event 
                           WHERE event_id = ?");
    $sql->bind_param("s", $eventId);
    $sql->execute();

    // Get the result set
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        // Fetch the event data
        $event = $result->fetch_assoc();
        echo json_encode([
        'success' => true,
        'endDate' => $event['event_end'],
        'startDate' => date('Y-m-d H:i:s'), 
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Event not found!'
        ]);
    }

    // Close the connection
    $conn->close();

?>

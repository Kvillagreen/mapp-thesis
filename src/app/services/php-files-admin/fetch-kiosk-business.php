<?php
include 'connection.php';
$data = json_decode(file_get_contents("php://input"), true);

// Get event_id from the input, or set a default value for testing
$eventId = $data['eventId'] ?? '';
$status = 'finished';  // Filter transactions by the status

// SQL query to fetch First_name, Last_name, and kiosk_name
$sql = "
    SELECT 
        u.First_name,
        u.Last_name,
        k.kiosk_name,
        t.status,
        t.purpose,
        t.date_created

    FROM 
        tbl_transactions t
    INNER JOIN 
        tbl_users u ON t.user_id = u.user_info_id
    INNER JOIN 
        tbl_kiosk k ON t.kiosk_id = k.kiosk_id
    WHERE 
        t.event_id = ? 
";

$response = [];
try {
    // Prepare the query
    $stmt = $conn->prepare($sql);

    // Bind the parameters (eventId and status)
    $stmt->bind_param("i", $eventId); // 'i' for integer and 's' for string

    // Execute the query
    $stmt->execute();

    // Fetch the result
    $result = $stmt->get_result();

    // Check if any records were found
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response[] = $row;
        }
    } else {
        $response = ["message" => "No records found"];
    }
} catch (Exception $e) {
    $response = ["error" => $e->getMessage()];
}

// Return the JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>

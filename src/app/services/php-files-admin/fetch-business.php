<?php
include 'connection.php';
$data = json_decode(file_get_contents("php://input"), true);

// Get event_id from the input, or set a default value for testing
$eventId = $data['eventId'] ?? 1;

// SQL query to fetch company names
$sql = "
    SELECT 
        u.Company_name, k.kiosk_name, u.user_info_id, u.First_name, u.Last_name
    FROM 
        tbl_users u
    INNER JOIN 
        tbl_transactions t ON u.user_info_id = t.user_id
    
    INNER JOIN 
        tbl_kiosk k ON t.kiosk_id = k.kiosk_id
    WHERE 
        t.event_id = ? AND t.status=?
";
$status='finished';
$response = [];
try {
    // Prepare the query
    $stmt = $conn->prepare($sql);

    // Bind the parameter
    $stmt->bind_param("is", $eventId,$status);

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

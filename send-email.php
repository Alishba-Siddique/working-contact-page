<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header("Access-Control-Allow-Origin: https://working-contact-page.netlify.app/");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Load Composer's autoloader for PHPMailer and dotenv
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get the raw POST data
$rawData = file_get_contents('php://input');
error_log("Raw received data: " . $rawData);

// Decode JSON data
$data = json_decode($rawData, true);
error_log("Decoded JSON data: " . print_r($data, true));

// Check if JSON is valid
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid JSON data: ' . json_last_error_msg()
    ]);
    exit;
}

// Check for missing required fields
$requiredFields = ['name', 'email', 'subject', 'message'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields: ' . implode(', ', $missingFields),
        'received_data' => $data
    ]);
    exit;
}

// Sanitize and validate user input
$name = filter_var($data['name'], FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$subject = filter_var($data['subject'], FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_var($data['message'], FILTER_SANITIZE_SPECIAL_CHARS);

// Validate email address
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email address!',
        'received_email' => $email
    ]);
    exit;
}

// Send email using PHPMailer
try {
    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 0; // Disable verbose debug output
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'];
    $mail->Password = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = 'tls';
    $mail->Port = $_ENV['SMTP_PORT'];

    // Recipients
    $mail->setFrom($_ENV['SMTP_USER'], 'Alishba Siddique');
    $mail->addAddress($_ENV['SMTP_USER']); // Send to your company email
    $mail->addReplyTo($email, $name); // Set reply-to as the sender's email

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "Contact Form: $subject";
    $mail->Body = "Name: $name<br>Email: $email<br>Message: $message";
    $mail->AltBody = strip_tags($message);

    // Send the email
    $mail->send();
    echo json_encode(['status' => 'success', 'message' => 'Email sent successfully']);
    exit;

} catch (Exception $e) {
    error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
    echo json_encode(['status' => 'error', 'message' => 'Message could not be sent. Please try again later.']);
    exit;
}

?> 
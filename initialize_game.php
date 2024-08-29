<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stamina = isset($_POST['stamina']) ? (int)$_POST['stamina'] : 10;
    $habilidade = isset($_POST['habilidade']) ? (int)$_POST['habilidade'] : 10;
    $sorte = isset($_POST['sorte']) ? (int)$_POST['sorte'] : 10;

    // Save the initial stats to the session or database
    session_start();
    $_SESSION['initialStats'] = [
        'stamina' => $stamina,
        'habilidade' => $habilidade,
        'sorte' => $sorte
    ];

    echo json_encode([
        'success' => true,
        'stamina' => $stamina,
        'habilidade' => $habilidade,
        'sorte' => $sorte
    ]);
    exit;
}

echo json_encode(['success' => false]);
?>
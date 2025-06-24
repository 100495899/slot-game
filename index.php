<?php
$tiradas = $_GET['runs'];
$id = $_GET['id'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Slot Machine</title>
  <meta charset="utf-8" />
  <meta name="theme-color" content="#000000" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="icon" href="./img/Cherry.png" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" />
  <link rel="stylesheet" type="text/css" href="./css/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="slot-machine-wrapper">
    <div class="screen">
      <canvas id="slot" width="440" height="240"></canvas>
      <div class="winner-display" id="win-container">
        <span id="win-amount" class="d-none">$</span>
      </div>
    </div>

    <div class="panel-controls">
      <div class="status-panel d-flex justify-content-between align-items-center">
        <div class="credits">
          <span>Tiradas:</span>
          <span id="credits" class="credit text-primary">0</span>
        </div>
        <div class="bet d-none">
          <span>Apuesta:</span>
          <span id="bet" class="bet text-white">10</span>
        </div>
      </div>

      <div class="buttons-row mt-3">
        <button id="minus-bet" class="bet-action-btn d-none">
          <i class="fas fa-minus"></i>
        </button>

        <button id="spin-manual" class="main-btn">
          <i class="fas fa-sync-alt"></i>
          <strong>PROBAR SUERTE</strong>
        </button>

        <button id="plus-bet" class="bet-action-btn d-none">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <div class="extra-buttons mt-3">
        <button id="pay-table" data-bs-toggle="modal" data-bs-target="#pay-table-modal">
          <i class="fas fa-table"></i> Tabla de Pagos
        </button>

        <button id="spin-auto">
          <i class="fas fa-play"></i> Auto | STOP
        </button>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="pay-table-modal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tabla de Pagos</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Aquí va el contenido generado por JS -->
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://unpkg.com/@n1md7/html-table-builder@1.0.1/dist/table_builder.min.js"></script>
  <script type="module" src="./js/main.mjs"></script>
  <script>
    var tiradas = '<?php echo $tiradas; ?>';
    var id = '<?php echo $id; ?>';
  </script>
</body>
</html>

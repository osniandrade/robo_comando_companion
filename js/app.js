document.addEventListener('DOMContentLoaded', function() {
    loadInitialStats();
});

document.addEventListener('DOMContentLoaded', function() {
    loadRobotInfo();
});

document.addEventListener('DOMContentLoaded', function() {
    renderCombatFoot();
});

document.addEventListener('DOMContentLoaded', function() {
    renderCombatRobots();
});

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.collapsible');
    sections.forEach(section => section.style.display = 'none');
});

document.getElementById('initial-stats-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const stamina = document.getElementById('stamina').value;
    const habilidade = document.getElementById('habilidade').value;
    const sorte = document.getElementById('sorte').value;

    fetch('initialize_game.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `stamina=${encodeURIComponent(stamina)}&habilidade=${encodeURIComponent(habilidade)}&sorte=${encodeURIComponent(sorte)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Game initialized successfully!');
            updateInitialStats(data);
        } else {
            alert('Failed to initialize game.');
        }
    });
});

function rollDice(numberOfDice) {
    let results = [];
    for (let i = 0; i < numberOfDice; i++) {
        results.push(Math.floor(Math.random() * 6) + 1); // Gera um número aleatório entre 1 e 6
    }
    document.getElementById('results-display').textContent = results.join(', ');
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section.style.display === 'none') {
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
    }
}

function renderCombatRobots() {
    const combatDiv = document.getElementById('combat-robots');
    combatDiv.innerHTML = '';

    for (let i = 1; i <= 6; i++) {
        combatDiv.innerHTML += `
            <div class="robot-block">
                <h3>Robô ${i}</h3>
                <label for="robot${i}-armour">Armadura:</label>
                <div class="button-group">
                    <button onclick="updateRobotStat(${i}, 'armour', 'decrement')">-</button>
                    <input type="number" id="robot${i}-armour" value="0" onchange="updateRobotStat(${i}, 'armour', 'set')">
                    <button onclick="updateRobotStat(${i}, 'armour', 'increment')">+</button>
                </div>
                <label for="robot${i}-speed">Velocidade:</label>
                <select id="robot${i}-speed">
                    <option value="lento">Lento</option>
                    <option value="médio">Médio</option>
                    <option value="rápido">Rápido</option>
                    <option value="muito rápido">Muito Rápido</option>
                </select>
                <label for="robot${i}-combat">Combate:</label>
                <div class="button-group">
                    <button onclick="updateRobotStat(${i}, 'combat', 'decrement')">-</button>
                    <input type="number" id="robot${i}-combat" value="0" onchange="updateRobotStat(${i}, 'combat', 'set')">
                    <button onclick="updateRobotStat(${i}, 'combat', 'increment')">+</button>
                </div>
                <label for="robot${i}-bonus">Bônus:</label>
                <textarea id="robot${i}-bonus"></textarea>
            </div>
        `;
    }
}

function updateRobotStat(robotId, statName, action) {
    const statElement = document.getElementById(`robot${robotId}-${statName}`);
    let currentValue;

    if (statName === 'speed') {
        // Para velocidade, apenas seleciona o valor
        return;
    }

    if (action === 'increment') {
        currentValue = parseInt(statElement.value) + 1;
    } else if (action === 'decrement') {
        currentValue = parseInt(statElement.value) - 1;
    } else if (action === 'set') {
        currentValue = parseInt(statElement.value);
    }

    statElement.value = currentValue;
}

function renderCombatFoot() {
    const combatDiv = document.getElementById('combat-foot');
    combatDiv.innerHTML = '';

    for (let i = 1; i <= 6; i++) {
        combatDiv.innerHTML += `
            <div class="enemy-block">
                <h3>Inimigo ${i}</h3>
                <label for="enemy${i}-habilidade">Habilidade:</label>
                <div class="button-group">
                    <button onclick="updateEnemyStat(${i}, 'habilidade', 'decrement')">-</button>
                    <input type="number" id="enemy${i}-habilidade" value="0" onchange="updateEnemyStat(${i}, 'habilidade', 'set')">
                    <button onclick="updateEnemyStat(${i}, 'habilidade', 'increment')">+</button>
                </div>
                <label for="enemy${i}-stamina">Stamina:</label>
                <div class="button-group">
                    <button onclick="updateEnemyStat(${i}, 'stamina', 'decrement')">-</button>
                    <input type="number" id="enemy${i}-stamina" value="0" onchange="updateEnemyStat(${i}, 'stamina', 'set')">
                    <button onclick="updateEnemyStat(${i}, 'stamina', 'increment')">+</button>
                </div>
            </div>
        `;
    }
}

function updateEnemyStat(enemyId, statName, action) {
    const statElement = document.getElementById(`enemy${enemyId}-${statName}`);
    let currentValue = parseInt(statElement.value);

    if (action === 'increment') {
        currentValue += 1;
    } else if (action === 'decrement') {
        currentValue -= 1;
    } else if (action === 'set') {
        currentValue = parseInt(statElement.value);
    }

    statElement.value = currentValue;
}

function saveRobot() {
    const robotName = document.getElementById('robot-name').value;
    const robotArmor = document.getElementById('robot-armor').value;
    const robotSpeed = document.getElementById('robot-speed').value;
    const robotCombat = document.getElementById('robot-combat').value;
    const robotBonus = document.getElementById('robot-bonus').value || '';
    const robotSpecialty = document.getElementById('robot-specialty').value || '';

    fetch('inventory.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `robot_name=${encodeURIComponent(robotName)}&robot_armor=${robotArmor}&robot_speed=${robotSpeed}&robot_combat=${robotCombat}&robot_bonus=${robotBonus}&robot_specialty=${encodeURIComponent(robotSpecialty)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadRobotInfo();
        }
    });
}

function loadRobotInfo() {
    fetch('inventory.php?get_robot=true')
        .then(response => response.json())
        .then(data => {
            if (data.name) {
                document.getElementById('robot-name').value = data.name;
                document.getElementById('robot-armor').value = data.armor;
                document.getElementById('robot-speed').value = data.speed;
                document.getElementById('robot-combat').value = data.combat;
                document.getElementById('robot-bonus').value = data.bonus;
                document.getElementById('robot-specialty').value = data.specialty;
            }
        });
}

function updateInitialStats(data) {
    document.getElementById('stamina-initial').textContent = data.stamina;
    document.getElementById('stamina-points').textContent = data.stamina;

    document.getElementById('habilidade-initial').textContent = data.habilidade;
    document.getElementById('habilidade-points').textContent = data.habilidade;

    document.getElementById('sorte-initial').textContent = data.sorte;
    document.getElementById('sorte-points').textContent = data.sorte;
}

function loadInitialStats() {
    fetch('inventory.php?get_initial_stats=true')
        .then(response => response.json())
        .then(data => {
            document.getElementById('stamina-initial').textContent = data.stamina;
            document.getElementById('stamina-points').textContent = data.stamina;

            document.getElementById('habilidade-initial').textContent = data.habilidade;
            document.getElementById('habilidade-points').textContent = data.habilidade;

            document.getElementById('sorte-initial').textContent = data.sorte;
            document.getElementById('sorte-points').textContent = data.sorte;
        });
}

function addItem() {
    const itemName = prompt('Nome do item:');
    if (itemName) {
        fetch('inventory.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(itemName)}`,
        }).then(() => {
            renderInventory();
        });
    }
}

function updateItemQuantity(id, action) {
    fetch('inventory.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}&action=${action}`,
    }).then(() => {
        renderInventory();
    });
}

function removeItem(id) {
    fetch('inventory.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`,
    }).then(() => {
        renderInventory();
    });
}

function renderInventory() {
    fetch('inventory.php')
        .then(response => response.json())
        .then(data => {
            const inventoryDiv = document.getElementById('inventory');
            inventoryDiv.innerHTML = '';
            data.forEach(item => {
                inventoryDiv.innerHTML += `
                    <div class="item">
                        <div class="item-info">
                            <span>${item.name} x${item.quantity}</span>
                        </div>
                        <div class="item-buttons">
                            <button onclick="updateItemQuantity(${item.id}, 'decrement')">-</button>
                            <button onclick="updateItemQuantity(${item.id}, 'increment')">+</button>
                            <button onclick="removeItem(${item.id})">Remover</button>
                        </div>
                    </div>
                `;
            });
        });
}

function updateStat(statName, action) {
    const statPointsElement = document.getElementById(`${statName}-points`);
    let currentValue = parseInt(statPointsElement.textContent);

    fetch('inventory.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `stat_name=${statName}&action=${action}&current_value=${currentValue}`
    })
    .then(response => response.json())
    .then(data => {
        statPointsElement.textContent = data.new_value;
    });
}

function loadStats() {
    fetch('inventory.php?get_stats=true')
        .then(response => response.json())
        .then(data => {
            document.getElementById('life-points').innerText = data.life_points;
            document.getElementById('energy-points').innerText = data.energy_points;
        });
}

function addNote() {
    const noteContent = document.getElementById('note-content').value;
    if (!noteContent) {
        alert('Nota vazia!');
        return;
    }
    fetch('inventory.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `note_content=${encodeURIComponent(noteContent)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('note-content').value = '';
            loadNotes();
        }
    });
}

function loadNotes() {
    fetch('inventory.php?get_notes=true')
        .then(response => response.json())
        .then(data => {
            const notesList = document.getElementById('notes-list');
            notesList.innerHTML = '';
            data.forEach(note => {
                notesList.innerHTML += `
                    <div class="note-item">
                        ${note.content}
                        <button onclick="deleteNote(${note.id})">Excluir</button>
                    </div>
                `;
            });
        });
}

function deleteNote(noteId) {
    fetch('inventory.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `delete_note=${noteId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadNotes();
        }
    });
}

// Carrega as anotações ao iniciar a página
loadNotes();

// Carrega os stats ao iniciar a página
loadStats();

document.addEventListener('DOMContentLoaded', renderInventory);

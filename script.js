let actors = [];
let combatStages = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2];
function addActor() {
    const name = document.getElementById('actorName').value;
    const type = document.getElementById('actorType').value;
    const stats = {
        hp: document.getElementById('actorHp').value,
        atk: document.getElementById('actorAtk').value,
        def: document.getElementById('actorDef').value,
        spa: document.getElementById('actorSpa').value,
        spd: document.getElementById('actorSpd').value,
        spe: document.getElementById('actorSpe').value,
    } // You'll define this
    const initiative = document.getElementById('actorSpe').value;
    const statuses = [];
    const stages = {
        hp: 6,
        atk: 6,
        def: 6,
        spa: 6,
        spd: 6,
        spe: 6,
    };

    const actor = { name, type, stats, statuses, stages, initiative };
    actors.push(actor);
    updateActorList();
}


function updateActorList() {
    actors.sort((a, b) => b.initiative - a.initiative); // Sorts in descending order
    const actorList = document.getElementById('actors');
    actorList.innerHTML = ''; // Clear existing list
    actors.forEach(actor => {
        console.log(actor);
        const li = document.createElement('li');
        li.textContent = `${actor.name} (${actor.type}) - Initiative: ${actor.initiative}`;
        li.onclick = () => showActorDetails(actor); // Define this function
        actorList.appendChild(li);
    });
}

function showActorDetails(actor) {
    const detailsDiv = document.getElementById('actorDetails');
    detailsDiv.innerHTML = `<h3>${actor.name}</h3><p>Type: ${actor.type}</p><p>Initiative: ${actor.initiative}</p>`;

    // Display stat adjustments
    Object.keys(actor.stats).forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.innerHTML = `<strong>${stat.toUpperCase()}:</strong> ${actor.stats[stat] * combatStages[actor.stages[stat]]} 
                             <button onclick="adjustStat('${actor.name}', '${stat}', -1)">-</button>
                             <button onclick="adjustStat('${actor.name}', '${stat}', 1)">+</button>`;
        detailsDiv.appendChild(statDiv);
    });

    // Status afflictions
    const statusDiv = document.createElement('div');
    statusDiv.innerHTML = `<strong>Status:</strong> ${actor.status || 'None'}<br>
                           <button onclick="updateStatus('${actor.name}', 'Paralysis')">Paralysis</button>
                           <button onclick="updateStatus('${actor.name}', 'Burn')">Burn</button>
                           <button onclick="updateStatus('${actor.name}', 'Poison')">Poison</button>
                           <button onclick="updateStatus('${actor.name}', 'None')">Clear Status</button>`;
    detailsDiv.appendChild(statusDiv);
}

function adjustStat(actorName, stat, adjustment) {
    const actor = actors.find(a => a.name === actorName);
    if (actor) {
        actor.stages[stat] += adjustment;
        if (stat == "spe"){
            console.log("Hi");
            actor.initiative = actor.stats['spe'] * combatStages[actor.stages['spe']];
        }
        showActorDetails(actor);
        updateActorList(); // If initiative changes based on stats
    }
}

function updateStatus(actorName, status) {
    const actor = actors.find(a => a.name === actorName);
    if (actor) {
        actor.status = status;
        showActorDetails(actor);
    }
}
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
    console.log(stats.hp);
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
    if (name === '' || type === '' || stats.hp === ''
    || stats.atk === '' || stats.def === '' || stats.spa === ''
    || stats.spd === '' || stats.spe === ''){
        return;
    }

    const actor = { name, type, stats, statuses, stages, initiative };
    actors.push(actor);
    updateActorList();
}


function updateActorList() {
    actors.sort((a, b) => b.initiative - a.initiative); // Sorts in descending order
    const actorList = document.getElementById('actors');
    actorList.innerHTML = `<tr id="head">
    <td><strong>Name</strong></td>
    <td><strong>Type</strong></td>
    <td><strong>Initiative</strong></td>
    </tr>`;
    let count = 0;
    // Clear existing list
    actors.forEach(actor => {
        const li = document.createElement('tr');
        li.id = "tr-" + count;
        count++;
        li.innerHTML = `
        <td class="third">${actor.name}</td>
        <td class="third">${actor.type}</td>
        <td class="third">${actor.initiative}</td>
        `;
        li.onclick = () => showActorDetails(actor); // Define this function
        actorList.appendChild(li);
    });
}

function showActorDetails(actor) {
    const actorList = document.getElementById('actors');
    for (i = 0; i < actors.length; i++){
        if (actors[i] !== actor){
            document.getElementById('tr-' + i).style.backgroundColor = "white";
            document.getElementById('tr-' + i).style.color = "black";
        }
        else {
            document.getElementById('tr-' + i).style.backgroundColor = "blue";
            document.getElementById('tr-' + i).style.color = "white";
        }
    }


    const detailsDiv = document.getElementById('actorDetails');
    detailsDiv.innerHTML = `<h3>${actor.name}</h3><p>Type: ${actor.type}</p><p>Initiative: ${actor.initiative}</p>`;

    // Display stat adjustments
    Object.keys(actor.stats).forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.innerHTML = `<strong>${stat.toUpperCase()}:</strong> ${Math.floor(actor.stats[stat] * combatStages[actor.stages[stat]])} 
                             <button onclick="adjustStat('${actor.name}', '${stat}', -1)">-</button>
                             <button onclick="adjustStat('${actor.name}', '${stat}', 1)">+</button>`;
        detailsDiv.appendChild(statDiv);
    });

    // Status afflictions
    const statusDiv = document.createElement('div');
    statusDiv.innerHTML = `
                           <button class="${actor.statuses.includes('Paralysed') ? "active" : "inactive"}" onclick="updateStatus('${actor.name}', 'Paralysed')">Paralysed</button>
                           <button class="${actor.statuses.includes('Burned') ? "active" : "inactive"}" onclick="updateStatus('${actor.name}', 'Burned')">Burn</button>
                           <button class="${actor.statuses.includes('Poisoned') ? "active" : "inactive"}" onclick="updateStatus('${actor.name}', 'Poisoned')">Poison</button>
                           <button class="${actor.statuses.includes('Frozen') ? "active" : "inactive"}" onclick="updateStatus('${actor.name}', 'Frozen')">Frozen</button>
                           <button class="${actor.statuses.includes('Confused') ? "active" : "inactive"}" onclick="updateStatus('${actor.name}', 'Confused')">Confused</button>
                           <button class="${actor.statuses.includes('Asleep') ? "active" : "inactive"}" onclick="updateStatus('${actor.name}', 'Asleep')">Asleep</button>
                           `;
    detailsDiv.appendChild(statusDiv);
}

function adjustStat(actorName, stat, adjustment) {
    const actor = actors.find(a => a.name === actorName);
    if (actor) {
        actor.stages[stat] += adjustment;
        if (actor.stages[stat] > 12){
            actor.stages[stat] = 12;
        }
        else if (actor.stages[stat] < 0){
            actor.stages[stat] = 0;
        }
        if (stat == "spe"){
            console.log("Hi");
            actor.initiative = Math.floor(actor.stats['spe'] * combatStages[actor.stages['spe']]);
        }
        showActorDetails(actor);
        updateActorList(); // If initiative changes based on stats
    }
}

function updateStatus(actorName, status) {
    const actor = actors.find(a => a.name === actorName);
    if (actor) {
        if (actor.statuses.includes(status)){
            console.log(actor.statuses);
            actor.statuses.splice(actor.statuses.indexOf(status), 1);
            console.log(actor.statuses);
            switch (status){
                case 'Paralysed':
                    actor.stages.spe += 4;
                    if (actor.stages.spe > 12){
                        actor.stages.spe = 12;
                    }
                    actor.initiative = Math.floor(actor.stats['spe'] * combatStages[actor.stages['spe']]);
                    break;
                case 'Poisoned':
                    actor.stages.spd += 2;
                    if (actor.stages.spe > 12){
                        actor.stages.spe = 12;
                    }
                    break;
                case 'Burned':
                    actor.stages.def += 2;
                    if (actor.stages.spe > 12){
                        actor.stages.spe = 12;
                    }
                    break;
            }
        }
        else {
            actor.statuses.push(status);
            switch (status){
                case 'Paralysed':
                    actor.stages.spe -= 4;
                    if (actor.stages.spe < 0){
                        actor.stages.spe = 0;
                    }
                    actor.initiative = Math.floor(actor.stats['spe'] * combatStages[actor.stages['spe']]);
                    break;
                case 'Poisoned':
                    actor.stages.spd -= 2;
                    if (actor.stages.spe < 0){
                        actor.stages.spe = 0;
                    }
                    break;
                case 'Burned':
                    actor.stages.def -= 2;
                    if (actor.stages.spe < 0){
                        actor.stages.spe = 0;
                    }
                    break;
            }
        }
        
        showActorDetails(actor);
        updateActorList();
    }
}
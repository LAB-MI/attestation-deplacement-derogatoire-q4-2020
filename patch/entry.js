import {generatePdf} from "../src/js/pdf-util.js"

window.addEventListener("load", async () => {

	let path = location.pathname.split("/").filter(Boolean).slice(1), 
		[who = "default", motif = "achats", minutes = 10] = path, 
		date = moment().subtract(minutes, "minutes"), 
		conf = await fetch("patch/profiles/" + who + ".json");

	if(!conf.ok) conf = await fetch("patch/profiles/default.json"); 

	let infos = await conf.json(), 
		profile = {
			...infos, 
			datesortie: date.format("DD[/]MM[/]YYYY"), 
			heuresortie: date.format("HH[:]mm")
		}, 
		blob = new Blob([await generatePdf(profile, motif, "src/certificate.pdf", date)], {type: "application/pdf"}), 
		link = document.createElement("a");

	link.href = window.URL.createObjectURL(blob);
	link.download = "attestation-" + date.format("YYYY[-]MM[-]DD[_]HH[-]mm") + ".pdf";
	link.click();
	
});
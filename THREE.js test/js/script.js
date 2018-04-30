var camera, scene, renderer;
var root;
var data;
var controls;

window.onload = function() {
	loadData();
}

function loadData()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				data = JSON.parse(this.responseText);
				init();
			}
	};
	xhttp.open("GET", "cats.json", true);
	xhttp.send();
}

function init(){
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	
	camera.position.z = 3;
	camera.position.x = 0;
	
	
	scene = new THREE.Scene();
	
	root = new THREE.Object3D();
	scene.add( root );
	
	var geometry = new THREE.PlaneBufferGeometry( 1 , 0.75);
	
	const loader = new THREE.TextureLoader();
	loader.setCrossOrigin("use-credentials");


	for (var i = 0; i < data.collection.length ;i++){	
		var item = data.collection[i];
		var material = new THREE.MeshBasicMaterial({
				map: loader.load(item.url),	
				side: THREE.DoubleSide 
			});
		var plane = new THREE.Mesh( geometry, material);
		// var coord = item.coords;
		plane.position.set(Math.random() * 100, Math.random() * 100, Math.random() * 100 );
		scene.add( plane );
	}
	
	
	//
	
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
	renderer.setClearColor( 0xff0000, 0 ); // the default
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	//

	controls = new THREE.OrbitControls(camera, renderer.domElement)
	controls.rotateSpeed = 0.5;
	
	window.addEventListener('resize', onResize);
	onResize();
	gameloop();
}

function onResize()
{
	var width = window.innerWidth;	
	var height = window.innerHeight;
	renderer.setSize(width, height);

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}


//game logic
function update() {
	
};

//draw scene
function render() {
	renderer.render(scene, camera);	
};


//run gameloop (update, render, repeat)
function gameloop() {
	requestAnimationFrame(gameloop);
	update();
	render();
};
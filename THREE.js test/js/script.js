var camera, scene, renderer;
var root;
var data;
// var controls;
var currentFrame = 0;
var targetFrame = 0;
var camSpeed = 1;

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
	
	scene = new THREE.Scene();
	
	root = new THREE.Object3D();
	scene.add( root );
	
	var geometry = new THREE.PlaneBufferGeometry( 1 , 0.75);
	
	var loader = new THREE.TextureLoader();
	loader.setCrossOrigin("*");

	var t = 0.0;
	var prev = null;

	for (var i = 0; i < data.collection.length ;i++){	
		var item = data.collection[i];
		item.photoURL = "https://picsum.photos/200/300/?random";
		item.coords = [
			(Math.sin(Math.sin(t)) * Math.cos(t * .001)) * 50,
			Math.sin(t * .5) * Math.cos(t * .01) * 5,
			Math.cos(t * .1) * (Math.sin(t * .33) * .5 + .5) * 50
		];
		var material = new THREE.MeshBasicMaterial({
				map: loader.load(item.photoURL),
				side: THREE.DoubleSide
			});
		var plane = new THREE.Mesh( geometry, material);
		var coord = item.coords;
		plane.position.set(coord[0], coord[1], coord[2]);
		scene.add( plane );

		if (i >= 1)
			plane.lookAt(prev.position);
		if (i === 1) {
			// still need to orient the first pic and the camera looking at it

			// orient first plane in the same way as the second
			prev.quaternion.copy(plane.quaternion);
			// orient camera in the same way as the first plane, so it looks head-on
			camera.quaternion.copy(plane.quaternion);
			camera.updateMatrixWorld();

			// "1m behind", according to the camera orientation
			var offset = new THREE.Vector3(0, 0, 1);
			offset.applyMatrix4(camera.matrixWorld);
			camera.position.addVectors(prev.position, offset);
		}

		prev = plane;

		t += .1;
	}


	//
	
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
	renderer.setClearColor( 0xff0000, 0 ); // the default
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	//

	// controls = new THREE.OrbitControls(camera, renderer.domElement)
	// controls.rotateSpeed = 0.5;

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
	var i1 = Math.floor(currentFrame);
	var i2 = (i1 + 1) % data.collection.length;

	var frameA = data.collection[i1];
	var frameB = data.collection[i2];
}

//draw scene
function render() {
	renderer.render(scene, camera);	
}


//run gameloop (update, render, repeat)
function gameloop() {
	requestAnimationFrame(gameloop);
	update();
	render();
}
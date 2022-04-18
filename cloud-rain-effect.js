import * as THREE from "three";

let scene, camera, renderer, cloudParticles = [], ambient, directionalLight, flash, rainDropPosition = [], rainDropVolocity = [], rainGeo, rainMat, rain, rainCount = 10000;

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    flash = new THREE.PointLight(0x0062d89, 30, 500, 1.7);
    flash.position.set(200, 300, 100);
    scene.add(flash);

    rainGeo = new THREE.BufferGeometry();
    let x, y, z, u, v, w;
    for (let i = 0; i < rainCount; i += 1) {
        x = Math.random() * 400 - 200;
        y = Math.random() * 500 - 250;
        z = Math.random() * 400 - 200;
        u = 0;
        v = (Math.random() * 5 + 0.12) * 1.0;
        w = 0;
        rainDropPosition.push(x, y, z);
        rainDropVolocity.push(u, v, w);
        rainGeo.setAttribute("position", new THREE.Float32BufferAttribute(rainDropPosition, 3));
        rainGeo.setAttribute("velocity", new THREE.Float32BufferAttribute(rainDropVolocity, 3));

        // rainGeo.velocity = {};
        // rainGeo.velocity = 0;
    }
    console.log(rainGeo);
    rainMat = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.2,
        depthTest: false,
        transparent: true,
        opacity: 0.7,
    });
    rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);
    console.log(rain);


    let loader = new THREE.TextureLoader();
    loader.load("smoke2.png", function (texture) {
        let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        let cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
        });

        for (let p = 0; p < 25; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random() * 800 - 400,
                500,
                Math.random() * 500 - 400
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 360;
            cloud.material.opacity = 0.6;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }
        animate();
    });
}
function animate() {
    cloudParticles.forEach(p => {
        p.rotation.z -= 0.005;
    });

    for (let i = 0; i < rainCount; i++) {
        rain.geometry.attributes.position.array[3 * i + 1] -= rain.geometry.attributes.velocity.array[3 * i + 1];

        if (rain.geometry.attributes.position.array[3 * i + 1] < 0) {
            rain.geometry.attributes.position.array[3 * i + 1] = Math.random() * 500 - 250;

            Math.floor(Math.random());
        }
    }
    rain.geometry.attributes.position.needsUpdate = true;

    if (Math.random() > 0.93 || flash.power > 100) {
        flash.position.set(
            Math.random() * 400,
            300 + Math.random() * 200,
            100
        );
        flash.power = 50 + Math.random() * 500;
    }

    // rain.rotation.x += 0.002;
    // rain.rotation.y += 0.002;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
init();


// ۱. راه اندازی صحنه سه بعدی Three.js
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// محاسبه اندازه‌های ریسپانسیو بر اساس عرض صفحه
function getResponsiveSizes() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const baseSize = Math.min(width, height) / 40;

    return {
        baseSize: baseSize,
        sphereRadius: Math.min(width, height) / 60,
        smallsphereRadius: Math.min(width, height) / 70,
        coneRadius: Math.min(width, height) / 70,
        coneHeight: Math.min(width, height) / 30,
        boxSize: Math.min(width, height) / 50,
        smallSphereRadius: Math.min(width, height) / 50,
        positionScale: Math.min(width, height) / 250
    };
}

// ۲. ساخت اشکال هندسی خطی (Wireframe)
let shapes = {};

function createShapes() {
    // حذف اشکال قبلی
    Object.values(shapes).forEach(shape => {
        if (shape.parent) {
            scene.remove(shape);
        }
    });

    const sizes = getResponsiveSizes();

    const materialCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const materialOrange = new THREE.MeshBasicMaterial({ color: 0xfda85b, wireframe: true });
    const materialGreen = new THREE.MeshBasicMaterial({ color: 0x4ade80, wireframe: true });
    const materialPink = new THREE.MeshBasicMaterial({ color: 0xf472b6, wireframe: true });

    // کره آبی 
    const sphereGeo = new THREE.SphereGeometry(sizes.sphereRadius, 15, 15);
    const mainSphere = new THREE.Mesh(sphereGeo, materialCyan);
    mainSphere.position.set(
        -6 * sizes.positionScale,
        3 * sizes.positionScale,
        0
    );
    scene.add(mainSphere);
    shapes.mainSphere = mainSphere;

    // کره نارنجی 
    const sphereOrg = new THREE.SphereGeometry(sizes.smallsphereRadius, 15, 15);
    const smallSphere = new THREE.Mesh(sphereOrg, materialOrange);
    smallSphere.position.set(
        7 * sizes.positionScale,
        -3 * sizes.positionScale,
        0
    );
    scene.add(smallSphere);
    shapes.smallSphere = smallSphere;

    // هرم سبز (مخروط با سگمنت کم)
    const coneGeo = new THREE.ConeGeometry(sizes.coneRadius, sizes.coneHeight, 4);
    const pyramid = new THREE.Mesh(coneGeo, materialGreen);
    pyramid.position.set(
        0 * sizes.positionScale,
        -2 * sizes.positionScale,
        2 * sizes.positionScale
    );
    pyramid.rotation.x = 0.5;
    scene.add(pyramid);
    shapes.pyramid = pyramid;

    // مکعب صورتی
    const boxGeo = new THREE.BoxGeometry(sizes.boxSize, sizes.boxSize, sizes.boxSize);
    const cube = new THREE.Mesh(boxGeo, materialPink);
    cube.position.set(
        5 * sizes.positionScale,
        4 * sizes.positionScale,
        -2 * sizes.positionScale
    );
    cube.rotation.set(0.4, 0.4, 0);
    scene.add(cube);
    shapes.cube = cube;

}

// ۳. راه اندازی دوربین و رندر کننده
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// ایجاد اشکال اولیه
createShapes();

// ۴. انیمیشن چرخش
function animate() {
    requestAnimationFrame(animate);

    if (shapes.mainSphere) {
        shapes.mainSphere.rotation.y += 0.002;
    }
    if (shapes.smallSphere) {
        shapes.smallSphere.rotation.x += 0.002;
        shapes.smallSphere.rotation.y += 0.002;
    }
    if (shapes.pyramid) {
        shapes.pyramid.rotation.y -= 0.003;
    }
    if (shapes.cube) {
        shapes.cube.rotation.x += 0.004;
        shapes.cube.rotation.y += 0.002;
    }

    renderer.render(scene, camera);
}
animate();

// ۵. اتصال حرکت‌ها به اسکرول با GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// تایم‌لاین انیمیشن اسکرول
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
    }
});

// ذخیره موقعیت‌های اولیه برای ریسپانسیو بودن
function getScrollPositions() {
    const scale = Math.min(window.innerWidth, window.innerHeight) / 100;
    return {
        sphereX: -15 * scale,
        sphereY: 10 * scale,
        smallsphereX: 15 * scale,
        smallsphereY: -10 * scale,
        pyramidX: -8 * scale,
        pyramidY: -12 * scale,
        cubeX: 12 * scale,
        cubeY: 5 * scale,
        cameraZ: Math.max(2, 15 - (window.innerWidth / 100))
    };
}

// تابع به‌روزرسانی انیمیشن اسکرول
function updateScrollAnimation() {
    const pos = getScrollPositions();

    // پاک کردن تایم‌لاین قبلی
    tl.clear();

    // ایجاد انیمیشن‌های جدید
    if (shapes.mainSphere) {
        tl.to(shapes.mainSphere.position, {
            x: pos.sphereX,
            y: pos.sphereY,
            ease: "none"
        }, 0);
    }

    if (shapes.smallSphere) {
        tl.to(shapes.smallSphere.position, {
            x: pos.smallsphereX,
            y: pos.smallsphereY,
            ease: "none"
        }, 0);
    }

    if (shapes.pyramid) {
        tl.to(shapes.pyramid.position, {
            x: pos.pyramidX,
            y: pos.pyramidY,
            ease: "none"
        }, 0);
    }

    if (shapes.cube) {
        tl.to(shapes.cube.position, {
            x: pos.cubeX,
            y: pos.cubeY,
            ease: "none"
        }, 0);
    }

    tl.to(camera.position, {
        z: pos.cameraZ,
        ease: "none"
    }, 0)
        .to(".header-title", {
            opacity: 0,
            y: -100,
            ease: "none"
        }, 0)
        .to("#lesson-card", {
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, 0.5);
}

// اجرای اولیه
updateScrollAnimation();

// ۶. مدیریت تغییر سایز پنجره
let resizeTimeout;

function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // به‌روزرسانی دوربین
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // بازسازی اشکال با سایز جدید
        createShapes();

        // به‌روزرسانی انیمیشن اسکرول
        updateScrollAnimation();
    }, 100);
}

window.addEventListener('resize', handleResize);

// به‌روزرسانی در چرخش صفحه (برای موبایل)
window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 300);
});


// ============================================
// کره‌های نقره‌ای کوچک (ذرات آزاد)
// ============================================
(function createSilverParticles() {
    const container = document.getElementById('particles-container');

    // ایجاد کانتینر اگر وجود ندارد
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'particles-container';
        newContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 0;
            pointer-events: none;
        `;
        document.body.prepend(newContainer);
    }

    const particlesContainer = document.getElementById('particles-container');

    // تنظیمات صحنه ذرات
    const particleScene = new THREE.Scene();

    const particleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    particleCamera.position.z = 20;

    const particleRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    particleRenderer.setSize(window.innerWidth, window.innerHeight);
    particleRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    particleRenderer.setClearColor(0x000000, 0);
    particlesContainer.appendChild(particleRenderer.domElement);

    // متریال نقره‌ای براق
    const silverMaterial = new THREE.MeshStandardMaterial({
        color: 0x868686,
    });

    // نورپردازی
    const ambientLight = new THREE.AmbientLight(0x404060);
    particleScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    particleScene.add(directionalLight);



    // ذرات
    const particleCount = 8;
    const particles = [];

    function getParticleSize() {
        const baseSize = Math.min(window.innerWidth, window.innerHeight) / 150;
        return Math.max(0.08, Math.min(0.4, baseSize));
    }

    function createParticles() {
        particles.forEach(p => particleScene.remove(p));
        particles.length = 0;

        const size = getParticleSize();
        const geometry = new THREE.SphereGeometry(size, 12, 12);

        for (let i = 0; i < particleCount; i++) {
            const sphere = new THREE.Mesh(geometry.clone(), silverMaterial);

            sphere.position.x = (Math.random() - 0.5) * 70;
            sphere.position.y = (Math.random() - 0.5) * 20;
            sphere.position.z = (Math.random() - 0.5) * 15;

            sphere.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.01
                ),
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                bounds: {
                    x: 15,
                    y: 10,
                    z: 7.5
                }
            };

            particleScene.add(sphere);
            particles.push(sphere);
        }
    }

    createParticles();

    // انیمیشن حرکت ذرات
    function animateParticles() {
        requestAnimationFrame(animateParticles);

        particles.forEach(sphere => {
            const data = sphere.userData;

            sphere.position.x += data.velocity.x;
            sphere.position.y += data.velocity.y;
            sphere.position.z += data.velocity.z;

            sphere.rotation.x += data.rotationSpeed.x;
            sphere.rotation.y += data.rotationSpeed.y;
            sphere.rotation.z += data.rotationSpeed.z;

            if (Math.abs(sphere.position.x) > data.bounds.x) {
                data.velocity.x *= -1;
                sphere.position.x += data.velocity.x * 2;
            }
            if (Math.abs(sphere.position.y) > data.bounds.y) {
                data.velocity.y *= -1;
                sphere.position.y += data.velocity.y * 2;
            }
            if (Math.abs(sphere.position.z) > data.bounds.z) {
                data.velocity.z *= -1;
                sphere.position.z += data.velocity.z * 2;
            }
        });

        particleRenderer.render(particleScene, particleCamera);
    }

    animateParticles();

    // ریسپانسیو کردن
    let resizeTimeout;
    function handleParticleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            particleCamera.aspect = window.innerWidth / window.innerHeight;
            particleCamera.updateProjectionMatrix();
            particleRenderer.setSize(window.innerWidth, window.innerHeight);
            createParticles();
        }, 200);
    }

    window.addEventListener('resize', handleParticleResize);
    window.addEventListener('orientationchange', () => {
        setTimeout(handleParticleResize, 400);
    });
})();

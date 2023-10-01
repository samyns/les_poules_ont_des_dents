function appliquerTransformations(etoiles, index, action) {
    etoiles.forEach((etoile, autreIndex) => {
        if (autreIndex < index + 1) {
            action(etoile, 1);
        }
        if (autreIndex > index) {
            action(etoile, 0);
        }
    });
}

function handleMouseEnter(etoiles, index) {
    appliquerTransformations(etoiles, index, (etoile, value) => {
        etoile.style.transform = `translate(0, ${value * -8}%)`;
    });
}

function handleMouseLeave(etoiles) {
    etoiles.forEach((etoile) => {
        etoile.style.transform = "translate(0, 0)";
    });
}

function handleClick(etoiles, index) {
    appliquerTransformations(etoiles, index, (etoile, value) => {
        etoile.querySelector('.test').style.transform = `scaleX(${value})`;
    });
}

function setupCritere(critere, etoiles, tests, valeursIndex) {
    let lastClickedIndex = -1;

    etoiles.forEach((etoile, index) => {
        etoile.addEventListener('mouseenter', () => {
            handleMouseEnter(etoiles, index);
        });

        etoile.addEventListener('mouseleave', () => {
            etoile.style.transform = "translate(0, 0)";
            appliquerTransformations(etoiles, index, (etoile) => {
                etoile.style.transform = "translate(0, 0)";
            });
        });

        etoile.addEventListener('click', () => {
            handleClick(etoiles, index);

            lastClickedIndex = index;

            setTimeout(() => {
                function scale_test() {
                    let note = 0;

                    tests.forEach((test) => {
                        let style = window.getComputedStyle(test);
                        let matrix = new WebKitCSSMatrix(style.transform);

                        let scaleX = matrix.a;

                        if (scaleX === 1) {
                            note = note + 1;
                        }
                    });
                    valeursIndex[0] = note;
                }

                scale_test();
            }, 1000);
        });
    });

    const contains = document.querySelectorAll(`.container.${critere}`);
    contains.forEach((cont) => {
        cont.addEventListener('mouseenter', () => {
        });

        cont.addEventListener('mouseleave', () => {
            handleMouseLeave(etoiles);
        });
    });
}

// Initialisation pour critère1
const etoile1 = document.querySelectorAll('#critère1 .etoiles');
const test1 = document.querySelectorAll('#critère1 .test');
const valeurs1 = [0];

setupCritere('critère1', etoile1, test1, valeurs1);

// Initialisation pour critère2
const etoile2 = document.querySelectorAll('#critère2 .etoiles');
const test2 = document.querySelectorAll('#critère2 .test');
const valeurs2 = [0];

setupCritere('critère2', etoile2, test2, valeurs2);

const etoiles1 = document.querySelectorAll('.etoiles');

etoiles1.forEach((etoile) => {
    etoile.addEventListener('click', () => {
        const tests = etoile.querySelectorAll('.test1 .test');
        const dernierIndexNonClique = Array.from(etoiles1).findIndex(etoile => !etoile.classList.contains('active'));

        tests.forEach((test, testIndex) => {
            test.style.transitionDelay = `${(dernierIndexNonClique + 1 + testIndex) % 5 * 0.05}s`;
        });
    });
});

const crit3 = document.getElementById('critère3');
const test3 = crit3.querySelectorAll('.test');
let values = [0, 0, 0, 0, 0];

function moyenne() {
    if (valeurs1[0] !== 0 && valeurs2[0] !== 0) {
        let moyenne = (valeurs1[0] + valeurs2[0]) / 2;
        let nombreEntier = Math.floor(moyenne);
        let nb = moyenne - nombreEntier;
        values[nombreEntier] = nb;
        for (let i = 0; i < nombreEntier; i++) {
            values[i] = 1;
        }
        for (let j = nombreEntier + 1; j < 5; j++) {
            values[j] = 0;
        }

        for (let k = 0; k < 5; k++) {
            test3[k].style.transform = `scaleX(${values[k]})`;
        }
    }
}

// Appelle la fonction toutes les secondes (1000 millisecondes)
setInterval(moyenne, 1000);

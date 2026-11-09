const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusBadge = document.getElementById('agent-status');

const clearBtn = document.getElementById('menu-clear-btn');
const importBtn = document.getElementById('menu-import-btn');
const exportBtn = document.getElementById('menu-export-btn');
const autotrainBtn = document.getElementById('menu-autotrain-btn');

let isTrainingMode = false;
let temporaryQuestion = "";
let isAutoCrawling = false;
// 🪙 TOKEN ECONOMY SYSTEM STATE
let tokenBalance = 50;
let lastResetDate = localStorage.getItem('token_reset_date') || "";

function checkAndResetDailyTokens() {
    const today = new Date().toDateString();
    
    // If a new day has arrived, reset the user to 50 tokens automatically
    if (lastResetDate !== today) {
        tokenBalance = 50;
        localStorage.setItem('token_reset_date', today);
        localStorage.setItem('agent_tokens', tokenBalance);
        logMessage("☀️ **Daily Reset**: 50 complimentary tokens have been credited to your account for today!", "system");
    } else {
        tokenBalance = parseInt(localStorage.getItem('agent_tokens')) || 50;
    }
    updateStatus(`Tokens: ${tokenBalance}`, "status-idle");
}

// Secret Recharge Key Tracker States
let secretKeysPressed = {};
window.addEventListener('keydown', (e) => {
    secretKeysPressed[e.key] = true;

    // Check if the user is holding down both '6' and '7' keys simultaneously
    if (secretKeysPressed['6'] && secretKeysPressed['7']) {
        const amountString = prompt("🪙 [SECRET RECHARGE UNLOCKED]\nEnter the number of tokens you wish to add to your balance:");
        const amount = parseInt(amountString);
        
        if (!isNaN(amount) && amount > 0) {
            tokenBalance += amount;
            localStorage.setItem('agent_tokens', tokenBalance);
            updateStatus(`Tokens: ${tokenBalance}`, "status-idle");
            logMessage(`🔋 **Secret Recharge Success**: Infused +${amount} tokens into your system database. New Balance: ${tokenBalance}`, "system");
        }
        // Wipe keystroke caches to prevent double-firing prompts
        secretKeysPressed = {};
    }
});

window.addEventListener('keyup', (e) => {
    secretKeysPressed[e.key] = false;
});

// Run an initial timestamp clock initialization check on page startup
checkAndResetDailyTokens();


// MASSIVE BUILT-IN CORE KNOWLEDGE DATASET (No Internet Needed)
const GLOBAL_KNOWLEDGE_BASE = {
    "biology": "Biology is the scientific study of life. It is a natural science with a broad scope but has several unifying themes that tie it together as a single, coherent field. For instance, all organisms are made up of cells that process hereditary information encoded in genes, which can be transmitted to future generations.",
    "computer science": "Computer science is the study of computation, information, and automation. Computer science spans theoretical disciplines (such as algorithms, theory of computation, and information theory) to applied disciplines (including the design and implementation of hardware and software).",
    "artificial intelligence": "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI applications include advanced web search engines, recommendation systems, understanding human speech, self-driving cars, and automated decision-making.",
    "world history": "World history is the field of historical study that examines history from a global perspective. It emerged as a distinct academic field in the late 20th century, focusing on networks, connections, and system-wide patterns that span across civilizational boundaries.",
    "physics": "Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force. Physics is one of the most fundamental scientific disciplines, with its main goal being to understand how the universe behaves.",
    "space exploration": "Space exploration is the ongoing discovery and exploration of celestial structures in outer space by means of continuously evolving and space technology. While the study of space is carried out mainly by astronomers with telescopes, the physical exploration of space is conducted both by unmanned robotic space probes and human spaceflight.",
    "javascript": "JavaScript is a high-level, often just-in-time compiled language that conforms to the ECMAScript specification. It has dynamic typing, prototype-based object-orientation, and first-class functions. It is one of the core technologies of the World Wide Web alongside HTML and CSS.",
    "html": "HyperText Markup Language (HTML) is the standard markup language for documents designed to be displayed in a web browser. It defines the content and structure of web content. It is often assisted by technologies such as Cascading Style Sheets (CSS) and scripting languages such as JavaScript.",
    "css": "Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript.",
    "python": "Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Python is dynamically typed and garbage-collected, supporting multiple programming paradigms including structured and object-oriented programming.",
    "chemistry": "Chemistry is the scientific study of the properties and behavior of matter. It is a natural science that covers the elements that make up matter to the compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.",
    "mathematics": "Mathematics is an area of knowledge that includes the study of such topics as numbers (arithmetic and number theory), formulas and related structures (algebra), shapes and the spaces in which they are contained (geometry), and quantities and their changes (calculus and analysis).",
    "astronomy": "Astronomy is a natural science that studies celestial objects and phenomena. It uses mathematics, physics, and chemistry in order to explain their origin and evolution. Objects of interest include planets, moons, stars, nebulae, galaxies, and comets.",
    "geography": "Geography is a field of science devoted to the study of the lands, features, inhabitants, and phenomena of Earth. The first person to use the word was Eratosthenes. Geography is an all-encompassing discipline that seeks an understanding of Earth and its human and natural complexities.",
    "geology": "Geology is an Earth science concerned with the solid Earth, the rocks of which it is composed, and the processes by which they change over time. Geology can also include the study of the solid features of any terrestrial planet or natural satellite such as Mars or the Moon.",
    "economics": "Economics is the social science that studies the production, distribution, and consumption of goods and services. Economics focuses on the behavior and interactions of economic agents and how economies work.",
    "philosophy": "Philosophy is the systematized study of general and fundamental questions, such as those about existence, reason, knowledge, values, mind, and language. Such questions are often posed as problems to be studied or resolved.",
    "psychology": "Psychology is the scientific study of mind and behavior. Psychology includes the study of conscious and unconscious phenomena, including feelings and thoughts. It is an academic discipline of immense scope, crossing the boundaries between the natural and social sciences.",
    "sociology": "Sociology is a social science that focuses on society, human social behavior, patterns of social relationships, social interaction, and aspects of culture associated with everyday life.",
    "archaeology": "Archaeology is the study of human activity through the recovery and analysis of material culture. The archaeological record consists of artifacts, architecture, biofacts or ecofacts, sites, and cultural landscapes.",
    "literature": "Literature is any collection of written work, but it is also used more narrowly for writings specifically considered to be an art form, especially prose fiction, drama, and poetry. In recent centuries, the definition has expanded to include oral literature.",
    "music": "Music is the arrangement of sound to create some combination of form, harmony, melody, rhythm, or otherwise expressive content. Definitions of music vary depending on culture and social context.",
    "art": "Art is a diverse range of human activity, and resulting product, that involves creative or imaginative talent expressive of technical proficiency, beauty, emotional power, or conceptual ideas.",
    "internet": "The Internet is a global system of interconnected computer networks that uses the Internet protocol suite (TCP/IP) to communicate between networks and devices. It is a network of networks that consists of private, public, academic, business, and government networks.",
    "world wide web": "The World Wide Web (WWW) is an information system enabling documents and other web resources to be accessed over the Internet according to specific rules, such as Hypertext Transfer Protocol (HTTP). Documents are redirected via URLs and are joined by hyperlinks.",
    "database": "A database is an organized collection of data or information that is typically stored electronically in a computer system. Databases are usually controlled by a database management system (DBMS).",
    "cloud computing": "Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user. Large clouds often have functions distributed over multiple locations from central servers.",
    "cybersecurity": "Cybersecurity is the protection of computer systems and networks from information disclosure, theft of or damage to their hardware, software, or electronic data, as well as from the disruption or misdirection of the services they provide.",
    "blockchain": "A blockchain is a distributed ledger with growing lists of records, called blocks, that are securely linked together using cryptography. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data.",
    "cryptocurrency": "A cryptocurrency is a digital or virtual currency secured by cryptography, which makes it nearly impossible to counterfeit or double-spend. Most cryptocurrencies exist on decentralized networks based on blockchain technology.",
    "cryptography": "Cryptography is the practice and study of techniques for secure communication in the presence of adversarial behavior. More generally, cryptography is about constructing and analyzing protocols that prevent third parties or the public from reading private messages.",
    "engineering": "Engineering is the use of scientific principles to design and build machines, structures, and other items, including bridges, tunnels, roads, vehicles, and buildings. The discipline of engineering encompasses a broad range of more specialized fields.",
    "robotics": "Robotics is an interdisciplinary branch of computer science and engineering. Robotics involves the design, construction, operation, and use of robots. The goal of robotics is to design machines that can help and assist humans.",
    "quantum computing": "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. Quantum computers utilize qubits instead of traditional binary bits.",
    "nanotechnology": "Nanotechnology is the manipulation of matter on an atomic, molecular, and supramolecular scale. The earliest, widespread description of nanotechnology referred to the particular technological goal of precisely manipulating atoms and molecules for fabrication of macroscale products.",
    "geography": "Geography is the study of places and the relationships between people and their environments. Geographers explore both the physical properties of Earth's surface and the human societies spread across it.",
    "mount everest": "Mount Everest is Earth's highest mountain above sea level, located in the Mahalangur Himal sub-range of the Himalayas. The international border between China and Nepal runs across its summit point.",
    "amazon rainforest": "The Amazon rainforest is a moist broadleaf tropical rainforest in the Amazon biome that covers most of the Amazon basin of South America. It represents over half of the planet's remaining rainforests.",
    "human heart": "The human heart is an organ that pumps blood throughout the body via the circulatory system, supplying oxygen and nutrients to the tissues and removing carbon dioxide and other wastes.",
    "brain": "The brain is an organ that serves as the center of the nervous system in all vertebrate and most invertebrate animals. It is the most complex organ in a vertebrate's body.",
    "skeleton": "The skeleton is the body part that forms the supporting structure of an organism. There are two different skeletal types: the exoskeleton, which is the stable outer shell of an organism, and the endoskeleton, which forms the support structure inside the body.",
    "mammal": "A mammal is a vertebrate animal of the class Mammalia. Mammals are characterized by the presence of milk-producing mammary glands for feeding their young, a neocortex region of the brain, fur or hair, and three middle ear bones.",
    "reptile": "Reptiles are an evolutionary group of tetrapod vertebrates comprising today's turtles, crocodilians, snakes, amphisbaenians, lizards, tuatara, and their extinct relatives.",
    "dinosaur": "Dinosaurs are a diverse group of reptiles of the clade Dinosauria. They first appeared during the Triassic period, between 243 and 233.23 million years ago, and became the dominant terrestrial vertebrates after the Triassic-Jurassic extinction event.",
        "solar system": "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud.",
    "telescope": "A telescope is an optical instrument used to make distant objects appear nearer, containing an arrangement of lenses, or of curved mirrors and lenses, by which rays of light are collected and focused and the resulting image magnified.",
    "printing press": "The printing press is a mechanical device for applying pressure to an inked surface resting upon a print medium, such as paper or cloth, thereby transferring the ink. It was invented by Johannes Gutenberg in the Holy Roman Empire around 1440.",
    "steam engine": "A steam engine is a heat engine that performs mechanical work using steam as its working fluid. The steam engine uses the force produced by steam pressure to push a piston back and forth inside a cylinder.",
    "electricity": "Electricity is the set of physical phenomena associated with the presence and motion of matter that has a property of electric charge. Electricity is related to magnetism, both being part of the phenomenon of electromagnetism.",
    "lightbulb": "An incandescent lightbulb is an electric light with a wire filament heated until it glows. The filament is enclosed in a glass bulb with a vacuum or inert gas to protect the filament from oxidation.",
    "automobile": "An automobile is a self-propelled motor vehicle intended for passenger transportation on land. It traditionally features four wheels and an internal combustion engine or an electric motor.",
    "airplane": "An airplane or aeroplane is a fixed-wing aircraft that is propelled forward by thrust from a jet engine, propeller, or rocket engine. Airplanes come in a variety of sizes, shapes, and wing configurations.",
    "telephone": "A telephone is a telecommunications device that permits two or more users to conduct a conversation when they are too far apart to be heard directly. A telephone converts sound into electronic signals.",
    "microscope": "A microscope is a laboratory instrument used to examine objects that are too small to be seen by the naked eye. Microscopy is the science of investigating small objects and structures using such an instrument.",
    "penicillin": "Penicillin is a group of antibiotics originally obtained from Penicillium moulds, principally Penicillium chrysogenum. Penicillin antibiotics are historically significant because they are the first drugs that were effective against many previously serious diseases.",
    "poetry": "Poetry is a form of literature that uses aesthetic and rhythmic qualities of language—such as phonaesthetics, sound symbolism, and metre—to evoke meanings in addition to, or in place of, a prosaic ostensible meaning.",
    "novel": "A novel is a relatively long work of narrative fiction, normally written in prose, which is typically published as a book. The genre has been described as having a continuous and comprehensive history of about two thousand years.",
    "philosophy": "Philosophy is the systematized study of general and fundamental questions, such as those about existence, reason, knowledge, values, mind, and language. Such questions are often posed as problems to be studied or resolved.",
    "psychology": "Psychology is the scientific study of mind and behavior. Psychology includes the study of conscious and unconscious phenomena, including feelings and thoughts, crossing the boundaries between natural and social sciences.",
    "economics": "Economics is the social science that studies the production, distribution, and consumption of goods and services. Economics focuses on the behavior and interactions of economic agents and how economies work.",
    "ancient egypt": "Ancient Egypt was a civilization of ancient Northeast Africa, concentrated along the lower reaches of the Nile River. Famous for building the Great Pyramids of Giza, mastering hieroglyphic writing, and advancing early mathematics and medicine.",
    "roman empire": "The Roman Empire was the post-republican period of ancient Rome, featuring large territorial holdings around the Mediterranean Sea across Europe, North Africa, and Western Asia. It established foundational systems of law, architecture, governance, and engineering.",
    "renaissance": "The Renaissance was a fervent period of European cultural, artistic, political, and scientific rebirth following the Middle Ages, spanning the 14th to the 17th century. It promoted the rediscovery of classical philosophy, literature, and art by figures like Leonardo da Vinci.",
    "industrial revolution": "The Industrial Revolution was the transition to new manufacturing processes in Europe and the United States, starting in the 1700s. It marked a major turning point in history, shifting economies from hand production methods to machine manufacturing and steam power.",
    "albert einstein": "Albert Einstein was a German-born theoretical physicist widely regarded as one of the greatest scientists of all time. He is best known for developing the theory of relativity, which revolutionized physics, and he also made foundational contributions to quantum mechanics.",
    "isaac newton": "Sir Isaac Newton was an English mathematician and physicist recognized as a foundational figure of the Scientific Revolution. He formulated the laws of motion and universal gravitation, co-invented calculus, and made groundbreaking discoveries in optics.",
    "marie curie": "Marie Curie was a Polish and naturalized-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize, the only woman to win it twice, and the only person to win in two different scientific fields (physics and chemistry).",
    "galileo galilei": "Galileo Galilei was an Italian astronomer, physicist, and engineer often called the father of observational astronomy and modern science. He pioneered the use of the telescope to observe planets and famously championed heliocentrism, the idea that the Earth revolves around the Sun.",
    "gravity": "Gravity is the natural force of attraction that causes mutual movement between all things with mass or energy. It keeps planets orbiting stars, holds the moon in orbit around Earth, and pulls objects directly down toward the ground.",
    "periodic table": "The periodic table is a tabular display of the chemical elements, organized by their atomic number, electron configuration, and recurring chemical properties. It was originally formulated by Russian chemist Dmitri Mendeleev in 1869.",
    "thermodynamics": "Thermodynamics is the branch of physical science that deals with the relations between heat, work, temperature, and energy. It describes how thermal energy is converted to and from other forms of energy and how it affects matter.",
    "quantum mechanics": "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles, where classical physics ceases to apply.",
    "evolution": "Evolution is the biological process of change in the heritable characteristics of living populations over successive generations. Driven heavily by natural selection, it explains the incredible diversity of life on Earth.",
    "ecosystem": "An ecosystem is a structural geographic area where plants, animals, and other organisms, as well as weather and landscape, work together to form a bubble of life. It encompasses both living (biotic) and non-living (abiotic) components.",
    "great wall of china": "The Great Wall of China is an ancient series of walls and fortifications built across the historical northern borders of ancient Chinese states to protect against nomadic invasions. It spans thousands of miles.",
    "eiffel tower": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. Constructed in 1889 as the entrance arch to the World's Fair, it has become a global cultural icon of France.",
    "internet": "The Internet is a massive global system of interconnected computer networks that communicates between networks and devices using the Internet protocol suite (TCP/IP). It serves as the foundation for the World Wide Web, global communication, and instant data transfer.",
    "cloud computing": "Cloud computing is the on-demand availability of computer system resources—especially data storage and processing computing power—hosted on remote internet servers instead of a user's local hardware device.",
    "cybersecurity": "Cybersecurity is the practice of protecting computer systems, servers, mobile devices, electronic architectures, networks, and private data from digital malicious attacks, unauthorized access, theft, or damage.",
    "database": "A database is an systematically organized, structured collection of data or information stored electronically in a computer system, typically controlled and managed by a Database Management System (DBMS).",
    "cryptocurrency": "A cryptocurrency is a digital or virtual alternative currency asset that uses cryptography to secure its transactional records, control the creation of additional units, and securely verify the transfer of assets on a blockchain.",
    "blockchain": "A blockchain is a decentralized, distributed digital ledger consisting of an unchangeable list of records called blocks. Each block is securely linked using cryptography to record transactions across many computers transparently.",
    "nanotechnology": "Nanotechnology is the manipulation and engineering of matter on an atomic, molecular, and supramolecular scale, typically dealing with structures sized between 1 and 100 nanometers.",
    "volcano": "A volcano is a rupture in the crust of a planetary-mass object, such as Earth, that allows hot lava, volcanic ash, and gases to escape from a magma chamber below the surface. They are most often found where tectonic plates are diverging or converging.",
    "earthquake": "An earthquake is the shaking of the surface of the Earth resulting from a sudden release of energy in the Earth's lithosphere that creates seismic waves. They can range in intensity from those that are too weak to be felt to those violent enough to propel objects and people into the air.",
    "tsunami": "A tsunami is a series of waves in a water body caused by the displacement of a large volume of water, generally in an ocean or a large lake. Earthquakes, volcanic eruptions and other underwater explosions above or below water all have the potential to generate a tsunami.",
    "world war i": "World War I was a global conflict centered in Europe that began on 28 July 1914 and lasted until 11 November 1918. It was fought between two major coalitions: the Allied Powers and the Central Powers, resulting in a dramatic reshaping of global geopolitics.",
    "world war ii": "World War II was a global conflict that lasted from 1939 to 1945. It involved the vast majority of the world's countries—including all of the great powers—forming two opposing military alliances: the Allies and the Axis, and stands as the deadliest conflict in human history.",
    "cold war": "The Cold War was a period of geopolitical tension between the United States and the Soviet Union and their respective allies, the Western Bloc and the Eastern Bloc, which began following the end of World War II and lasted until the dissolution of the USSR.",
    "vaccine": "A vaccine is a biological preparation that provides active acquired immunity to a particular infectious disease. It typically contains an agent that resembles a disease-causing microorganism and is often made from weakened or killed forms of the microbe.",
    "antibiotics": "Antibiotics are a type of antimicrobial substance active against bacteria. They are the most important type of antibacterial agent for fighting bacterial infections, and antibiotic medications are widely used in the treatment and prevention of such infections.",
    "dna": "Deoxyribonucleic acid (DNA) is a polymer composed of two polynucleotide chains that coil around each other to form a double helix. It carries the genetic instructions for the development, functioning, growth, and reproduction of all known organisms.",
    "inflation": "Inflation is a general increase in prices and a fall in the purchasing value of money over time. When the general price level rises, each unit of currency buys fewer goods and services; consequently, inflation reflects a reduction in purchasing power.",
    "stock market": "A stock market is a public market for the aggregating of buyers and sellers of stocks, which represent ownership claims on businesses. These may include securities listed on a public stock exchange, as well as stock that is only traded privately.",
    "central bank": "A central bank is an institution that manages the currency and monetary policy of a state or formal monetary union. Its primary function is to maintain price stability, control interest rates, and manage the nation's money supply.",
    "impressionism": "Impressionism was a 19th-century art movement characterized by relatively small, thin, yet visible brush strokes, open composition, and an emphasis on the accurate depiction of light in its changing qualities, ordinary subject matter, and unusual visual angles.",
    "surrealism": "Surrealism was a cultural movement that began in the early 1920s, best known for its visual artworks and writings. Artists painted unnerving, illogical scenes with photographic precision, creating strange creatures from everyday objects to express the workings of the subconscious mind.",
    "thomas edison": "Thomas Edison was an American inventor and businessman who has been described as America's greatest inventor. He developed many devices in fields such as electric power generation, mass communication, sound recording, and motion pictures, including the phonograph and the long-lasting electric lightbulb.",
    "nikola tesla": "Nikola Tesla was a Serbian-American engineer and physicist who made revolutionary contributions to the design of the modern alternating current (AC) electricity supply system. He was a brilliant inventor who also experimented with wireless power transmission and early radio tech.",
    "william shakespeare": "William Shakespeare was an English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world's pre-eminent dramatist. He authored legendary plays including Romeo and Juliet, Hamlet, and Macbeth.",
    "leonardo da vinci": "Leonardo da Vinci was an Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, scientist, theorist, sculptor, and architect. While his initial fame rested on masterpieces like the Mona Lisa and The Last Supper, his notebooks contain sketches of flying machines and early anatomy.",
    "machu picchu": "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a mountain ridge. It is one of the most famous archaeological icons of the ancient world, showcasing highly advanced dry-stone engineering structures.",
    "taj mahal": "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal, and stands as a crown jewel of Indo-Islamic architecture.",
    "gastronomy": "Gastronomy is the study of the relationship between food and culture, the art of preparing and serving rich or delicate food, the cooking styles of particular regions, and the science of good eating.",
    "ancient greece": "Ancient Greece was a northeastern Mediterranean civilization that flourished from the Greek Dark Ages to the end of classical antiquity. It is widely considered the cradle of Western civilization, pioneering philosophy, theater, architecture, mathematics, and democratic systems of government.",
    "mayan civilization": "The Maya civilization was a Mesoamerican civilization developed by the Maya peoples, noted for its logosyllabic script—the most sophisticated writing system in the pre-Columbian Americas—as well as for its highly accurate astronomical tracking systems, calendar formulas, art, and stepped pyramids.",
    "react": "React is an open-source JavaScript library developed by Meta for building user interfaces, particularly single-page applications. It introduces a component-based architecture and a Virtual DOM, which optimizes rendering performance by updating only changed elements.",
    "node js": "Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome's V8 engine. It allows developers to run JavaScript code on the server side, utilizing an event-driven, non-blocking I/O model that makes it highly efficient for scalable network apps.",
    "sql": "Structured Query Language (SQL) is a standardized programming language used for managing and manipulating relational databases. It allows developers to perform tasks such as querying data, updating records, creating tables, and managing data structures through relational tables.",
    "nosql": "NoSQL refers to non-relational database systems that store data in formats other than traditional tables, such as documents, key-value pairs, graphs, or wide-columns. They are designed to scale horizontally and handle massive amounts of unstructured data.",
    "mongodb": "MongoDB is a popular open-source, non-relational NoSQL database program. It uses JSON-like documents with optional schemas (BSON format), making data integration for modern, cloud-based web applications incredibly flexible and fast.",
    "express js": "Express.js is a minimal and flexible web application framework for Node.js. It provides a robust set of features for building single-page, multi-page, and hybrid web applications, and is a core component of the popular MERN and MEAN JavaScript tech stacks.",
    "angular": "Angular is a TypeScript-based, open-source web application framework led by Google. It is a complete rewrite of AngularJS and provides a comprehensive, opinionated platform for building scalable enterprise web applications with two-way data binding.",
    "vue js": "Vue.js is an open-source, progressive JavaScript framework used for building user interfaces and single-page web applications. It is designed to be incrementally adoptable, focusing heavily on the view layer while remaining easy to integrate with other libraries.",
    "typescript": "TypeScript is an open-source programming language developed by Microsoft that acts as a strict syntactical superset of JavaScript. It adds optional static typing to the language, helping developers catch compilation bugs early in large-scale codebases.",
    "git": "Git is a decentralized version control system designed to handle everything from small to very large software development projects with speed and efficiency. It allows multiple developers to work on the same codebase simultaneously by tracking text file changes.",
    "docker": "Docker is an open-source platform that uses OS-level virtualization to deliver software applications in packages called containers. Containers bundle an application with all its required dependencies, libraries, and configuration files, ensuring it runs identically on any system.",
    "api": "An Application Programming Interface (API) is a set of rules and protocols that allows different software applications to communicate with one another. It defines the correct methods for a frontend client interface to request data securely from a backend server database.",
    "addition": "Addition is a basic arithmetic operation that represents combining collections of objects together into a larger total sum, denoted by the plus sign.",
    "subtraction": "Subtraction is an arithmetic operation that represents the process of removing objects from a collection, resulting in a difference denoted by the minus sign.",
    "multiplication": "Multiplication is a mathematical operation that scales one number by another. It can be viewed as a process of repeated addition, resulting in a product.",
    "division": "Division is an arithmetic operation that is the inverse of multiplication, representing the process of distributing a total amount into equal parts or groups.",
    "algebra": "Algebra is a broad branch of mathematics that uses variables, symbols, and letters to represent numbers and values in equations, allowing formulas to be solved for unknown quantities.",
    "geometry": "Geometry is a branch of mathematics concerned with the properties, measurement, and relationships of points, lines, angles, surfaces, shapes, and solids.",
    "calculus": "Calculus is the mathematical study of continuous change, focusing on derivatives (which measure rates of change) and integrals (which measure accumulation of areas or volumes).",
    "fraction": "A fraction represents a part of a whole or, more generally, any number of equal parts, written as a numerator divided by a non-zero denominator.",
    "decimal": "A decimal is a fraction or number written in a base-10 positional notation system, using a decimal point to separate whole integers from fractional values less than one.",
    "percentage": "A percentage is a number or ratio expressed as a fraction of 100, commonly used to compare magnitudes or track relative changes and proportions.",
    "equation": "An equation is a mathematical statement asserting the equality of two expressions, typically separated by an equals sign and solved to find unknown variables.",
    "variable": "A variable is a symbol, usually a letter like x or y, used in mathematical expressions to represent a number that can change, vary, or is currently unknown.",
    "matrix": "A matrix is a rectangular array or grid of numbers, symbols, or expressions arranged in rows and columns, frequently used to solve systems of linear equations.",
    "trigonometry": "Trigonometry is a branch of mathematics that studies the specific relationships involving lengths and angles of triangles, particularly right-angled triangles.",
    "statistics": "Statistics is the science and practice of collecting, reviewing, analyzing, interpreting, and presenting large blocks of empirical numerical data.",
    "probability": "Probability is the branch of mathematics concerning numerical descriptions of how likely an event is to occur, scaled from 0 (impossible) to 1 (certain).",
    "prime number": "A prime number is a whole integer greater than 1 that cannot be formed by multiplying two smaller natural numbers, meaning it is only divisible by 1 and itself.",
    "pi": "Pi, represented by the Greek letter π, is a mathematical constant defined as the ratio of a circle's circumference to its diameter, approximately equal to 3.14159.",
    "infinity": "Infinity is an abstract mathematical concept describing something that is boundless, endless, or completely limitless, larger than any real natural number.",
    "binary": "Binary is a base-2 positional numeral system that uses only two digits, 0 and 1, to represent mathematical values and serve as the core language of computer architectures.",
    "set theory": "Set theory is the branch of mathematical logic that studies sets, which are structured collections of distinct objects or numbers treated as a single entity.",
    "algorithm": "An algorithm is a finite, step-by-step sequence of rigorous mathematical or logical instructions used to solve specific problems or perform computations.",
    "how to make a platformer game": "To make a platformer game (like Mario):\n1. Setup a 2D physics engine with gravity and collision blocks.\n2. Create a player entity with 'Velocity X' for walking and a 'Jump Force' triggered by the spacebar.\n3. Add tilemaps for platforms and implement floor collision detection (Collision.bottom) so the player cannot jump mid-air.\n4. Design enemy sprites with basic left-to-right looping movements.",
    "how to make an rpg game": "To make a Role-Playing Game (RPG):\n1. Build an array-based grid or map for player navigation (top-down or isometric view).\n2. Create a player data object containing attributes: health, level, experience, and inventory array.\n3. Implement a tile collision system for walls, houses, and trees.\n4. Add an interaction function: when the player is next to an NPC, pause movement and render text strings onto a dialog box layout.",
    "how to make a shooter game": "To make a shooter game:\n1. Track mouse movement coordinates to rotate the player's weapon towards the cursor position.\n2. Create an event listener: when clicking, instantiate a bullet object at the weapon coordinates with a directional velocity vector.\n3. Run a game loop array checking collisions between bullet coordinates and enemy boundary hitboxes.\n4. Delete bullets from browser memory once they leave the screen boundary to prevent memory leaks.",
    "how to make an endless runner game": "To make an endless runner game (like Flappy Bird or Temple Run):\n1. Lock the player's horizontal position on the screen, allowing only vertical movement (jumping or ducking).\n2. Create an obstacle generation loop that spawns random obstacle blocks off-screen to the right and shifts their X position left over time.\n3. Move background textures continuously using a wrapping parallax effect to simulate forward speed.\n4. Increment a score counter tracking time survived, and trigger a game-over sequence if player coordinates overlap an obstacle.",
    "how to make a puzzle game": "To make a puzzle game (like Tetris or Match-3):\n1. Define a 2D multi-dimensional array grid tracking grid coordinates (e.g., an 8x8 matrix grid).\n2. Write a function that checks for matching adjacent cell elements (horizontal or vertical arrays of 3 matching values).\n3. If a match is found, clear those array indexes out, update the scoreboard, and trigger a falling loop function to shift higher blocks down into the empty grid slots.\n4. Provide keyboard controls to let players slide or swap adjacent array elements.",
    "game loop": "A game loop is the core heartbeat engine architecture of any video game. It runs continuously on a loop tracking three key functions: 1. Input processing (reading keyboard/mouse updates), 2. State updates (calculating physics, velocities, and tracking player scores), and 3. Rendering (drawing the updated sprites and backgrounds onto the browser canvas element).",
    "collision detection": "Collision detection is the computational technique used to determine if two digital objects or boundaries intersect on screen. It is frequently calculated using Axis-Aligned Bounding Boxes (AABB), comparing whether object A's maximum coordinates are less than object B's minimum coordinates across both X and Y geometric space planes.",
    "sprite": "A sprite is a two-dimensional bitmap image or animation graphic integrated into a video game world. Sprites represent characters, props, projectiles, or decoration blocks, and their placement coordinates are constantly shifted by the main physics updating loop.",
        "atom": "An atom is the basic unit of a chemical element, consisting of a central nucleus surrounded by a cloud of negatively charged electrons.",
    "molecule": "A molecule is a group of two or more atoms held together by chemical bonds, representing the smallest fundamental unit of a chemical compound.",
    "electron": "An electron is a stable subatomic particle with a negative charge of electricity, found acting as the primary carrier of electricity in solids.",
    "proton": "A proton is a stable subatomic particle occurring in all atomic nuclei, carrying a positive electric charge equal in magnitude to that of an electron.",
    "neutron": "A neutron is a subatomic particle of about the same mass as a proton but without an electric charge, present in all atomic nuclei except those of ordinary hydrogen.",
    "acid": "An acid is a chemical substance, usually a liquid, that neutralizes alkalis, turns litmus paper red, corrodes some metals, and typically tastes sour.",
    "base": "A base is a chemical substance that reacts with acids to form salts, turns litmus paper blue, feels slippery, and has a pH greater than 7.",
    "ph scale": "The pH scale is a numeric scale used to specify the acidity or basicity of an aqueous solution, ranging from 0 (highly acidic) to 14 (highly basic).",
    "mitosis": "Mitosis is a type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.",
    "meiosis": "Meiosis is a type of cell division that reduces the number of chromosomes in the parent cell by half and produces four gamete cells, essential for sexual reproduction.",
    "photosynthesis": "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.",
    "enzyme": "An enzyme is a biological catalyst, almost always a protein, that speeds up the rate of a specific chemical reaction in a cell without being consumed.",
    "virus": "A virus is an submicroscopic infectious agent that replicates only inside the living cells of an organism, infecting all types of life forms.",
    "bacteria": "Bacteria are microscopic, single-celled organisms that thrive in diverse environments, acting as decomposers, pathogens, or critical symbiotic partners.",
    "immune system": "The immune system is a complex network of biological structures and processes that protects an organism against disease by identifying and killing pathogens.",
    "antibody": "An antibody is a protective protein produced by the immune system in response to the presence of a foreign substance, called an antigen.",
    "hormone": "A hormone is a chemical signaling molecule, secreted by glands directly into the blood, that regulates the activity of distant organs and tissues.",
    "nervous system": "The nervous system is a highly complex part of an animal that coordinates its actions and sensory information by transmitting signals to and from different body parts.",
    "respiratory system": "The respiratory system is a biological system consisting of specific organs and structures used for gas exchange in animals and plants.",
    "circulatory system": "The circulatory system is an organ system that permits blood to circulate and transport nutrients, oxygen, carbon dioxide, hormones, and blood cells to and from cells.",
    "digestive system": "The digestive system consists of the gastrointestinal tract plus the accessory organs of digestion, working together to break down food into absorbable nutrients.",
    "kidney": "The kidney is a bean-shaped organ that filters waste products, excess water, and other impurities from the blood, producing urine to be excreted.",
    "liver": "The liver is a large, meaty organ that sits on the right side of the belly, responsible for detoxifying chemicals, metabolizing drugs, and secreting bile.",
    "lung": "The lungs are a pair of spongy, air-filled organs located on either side of the chest that take in oxygen and release carbon dioxide as we breathe.",
    "plate tectonics": "Plate tectonics is the scientific theory that Earth's outer shell is divided into several large structural plates that glide fluidly over the rocky mantle.",
    "fossil": "A fossil is any preserved remains, impression, or trace of any once-living thing from a past geological age, crucial for charting evolutionary histories.",
    "mineral": "A mineral is a naturally occurring inorganic solid substance with a definite chemical composition and an ordered internal atomic crystalline structure.",
    "atmosphere": "The atmosphere is a layer or a set of layers of gases surrounding a planet or other material body, held securely in place by the pull of gravity.",
    "exosphere": "The exosphere is the outermost layer of Earth's atmosphere, where the atmosphere thins out into the vacuum of space and gas molecules can escape into orbit.",
    "stratosphere": "The stratosphere is the second major layer of Earth's atmosphere, just above the troposphere, containing the ozone layer which absorbs harmful ultraviolet radiation.",
    "ozone layer": "The ozone layer is a region of Earth's stratosphere that absorbs most of the Sun's ultraviolet radiation, acting as a crucial shield for terrestrial life.",
    "gladier": "A glacier is a persistent body of dense ice that is constantly moving under its own weight, forming where the accumulation of snow exceeds its ablation over many years.",
    "nebula": "A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases, frequently acting as a nursery where new stars are born.",
    "pulsar": "A pulsar is a highly magnetized rotating neutron star that emits beams of electromagnetic radiation out of its magnetic poles at highly precise intervals.",
    "quasar": "A pulsar is an extremely luminous active galactic nucleus, in which a supermassive black hole is surrounded by a gaseous accretion disk radiating immense energy.",
    "exoplanet": "An exoplanet or extrasolar planet is a planet that orbits a star outside our own Solar System, discovered across thousands of deep space planetary networks.",
    "asteroid belt": "The asteroid belt is a torus-shaped region in the Solar System, located roughly between the orbits of the planets Mars and Jupiter, occupied by numerous irregular asteroids.",
    "comet": "A comet is an icy, small Solar System body that, when passing close to the Sun, warms and begins to release gases, displaying a visible atmosphere or tail.",
    "light year": "A light-year is a unit of astronomical distance equivalent to the distance that light travels in one Earth year, which is roughly 6 trillion miles.",
    "milky way": "The Milky Way is the barred spiral galaxy that contains our Solar System, visible from Earth as a hazy band of light across the night sky.",
    "speed of light": "The speed of light in a vacuum is a universal physical constant exactly equal to 299,792,458 meters per second, acting as the absolute speed limit of the universe.",
    "absolute zero": "Absolute zero is the lowest thermodynamic temperature theoretically possible, equal to minus 273.15 degrees Celsius, where all classical molecular motion stops.",
    "entropy": "Entropy is a scientific concept and physical property that is most commonly associated with a state of disorder, randomness, or uncertainty within a system.",
    "friction": "Friction is the resistive force resisting the relative motion of solid surfaces, fluid layers, and material elements sliding or rolling against each other.",
    "velocity": "Velocity is a physical vector quantity that specifies both the speed of an object's motion and its exact direction of movement in geometric space.",
    "acceleration": "Acceleration is a physical vector quantity that represents the rate at which the velocity of a moving object changes over a given interval of time.",
    "momentum": "Momentum is the physical quantity of motion of a moving body, mathematically calculated as the product of an object's mass and its velocity vector.",
    "inertia": "Inertia is the inherent property of matter by which it continues in its existing state of rest or uniform motion in a straight line, unless changed by an external force.",
    "centrifugal force": "Centrifugal force is an apparent outward inertial force experienced by an object moving along a curved path, directed away from the center of rotation.",
    "kinetic energy": "Kinetic energy is the form of mechanical energy that an object or particle possesses by virtue of being in an active state of motion.",
    "potential energy": "Potential energy is the stored energy possessed by an object relative to its position, internal stresses, electric charge, or other structural states.",
    "refraction": "Refraction is the physical phenomenon of light or sound waves bending as they pass from one medium into another of differing density, altering their speed.",
    "reflection": "Reflection is the physical change in direction of a wavefront at an interface between two different media so that the wavefront returns into the medium from which it originated.",
    "diffraction": "Diffraction refers to various physical phenomena that occur when a wave encounters an obstacle or opening, causing the wave to bend around corners or spread out.",
    "magnetism": "Magnetism is a class of physical phenomena mediated by magnetic fields, where materials exert attractive or repulsive forces on other magnetic substances.",
    "laser": "A laser is a device that emits light through a process of optical amplification based on the stimulated emission of electromagnetic radiation, creating a narrow, intense beam.",
    "superconductivity": "Superconductivity is a set of physical properties observed in certain materials, where electrical resistance drops to zero and magnetic fields are completely expelled.",
    "dark matter": "Dark matter is a hypothetical component of the universe that is invisible to telescopes, as it does not emit or absorb light, but accounts for most of the universe's mass.",
    "dark energy": "Dark energy is a mysterious, unknown force that permeates all of space and is hypothesized to be driving the accelerating expansion of the universe.",
    "string theory": "String theory is a theoretical framework in physics in which the point-like particles of particle physics are replaced by one-dimensional vibrating strings.",
    "matrix algebra": "Matrix algebra is a branch of mathematics focused on the study of vectors and matrices, providing critical mathematical layers used to map 3D computer graphics.",
    "prime number": "A prime number is a natural whole integer greater than 1 that cannot be formed by multiplying two smaller natural numbers, divisible only by 1 and itself.",
    "fibonacci sequence": "The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1, frequently found mirrored in nature.",
    "probability theory": "Probability theory is the branch of mathematics concerned with the analysis of random phenomena, mapping the likelihood of specific values occurring.",
    "calculus derivative": "A derivative is a fundamental tool in calculus that measures the instantaneous rate at which a mathematical function's value changes relative to a changing variable.",
    "calculus integral": "An integral is a fundamental tool in calculus that assigns numbers to functions in a way that can describe displacement, area, volume, and other concepts of accumulation.",
    "binary code": "Binary code represents text, computer processor instructions, or any other data using a two-symbol system, typically the binary digits 0 and 1.",
    "compiler": "A compiler is a specialized computer program that translates software source code written in a high-level programming language into a lower-level machine language.",
    "interpreter": "An interpreter is a computer program that directly executes instructions written in a programming or scripting language, without requiring them to be compiled first.",
    "operating system": "An operating system is system software that manages computer hardware and software resources, providing critical common services for execution programs.",
    "ram memory": "Random-Access Memory (RAM) is a form of temporary computer data storage that stores data and machine code currently being read and modified by the processor.",
    "hard drive": "A hard disk drive is an electro-mechanical data storage device that uses magnetic storage to store and retrieve digital information using rapidly rotating platters.",
    "cpu processor": "The Central Processing Unit (CPU) is the electronic machinery that executes instructions comprising a computer program, acting as the primary brain of the hardware.",
    "gpu graphics card": "A Graphics Processing Unit (GPU) is a specialized electronic circuit designed to rapidly manipulate and alter memory to accelerate the creation of 3D display images.",
    "router": "A router is a networking device that forwards data packets between computer networks, directing web traffic efficiently along information pathways.",
    "ip address": "An Internet Protocol (IP) address is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication.",
    "dns server": "The Domain Name System (DNS) is a hierarchical naming system for computers or resources connected to the Internet, translating text domain names into numerical IP addresses.",
    "http protocol": "The Hypertext Transfer Protocol (HTTP) is an application layer protocol used as the foundational data communication framework for the World Wide Web.",
    "ssl certificate": "Secure Sockets Layer (SSL) certificates are digital keys that encrypt the connection between a web browser client and a web server, safeguarding transmission pathways.",
    "firewall": "A firewall is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules, blocking malicious attacks.",
    "encryption": "Encryption is the process of scrambling readable text data into an unreadable format using cryptographic keys, ensuring it can only be decoded by authorized keys.",
    "hashing": "Hashing is the cryptographic process of turning a string of text of any length into a fixed-length numerical signature value, used to securely verify data integrity.",
    "git repository": "A Git repository is a digital storage structure tracking code text files, allowing version control systems to log project developments across a timeline.",
    "rest api": "A REST API is an architectural style for an application programming interface that uses HTTP requests to access, input, download, and modify data elements over the web.",
    "virtual dom": "The Virtual DOM is a programming concept where an idealized, lightweight representation of a webpage user interface is kept in memory and synced with the real DOM.",
    "docker container": "A Docker container is a lightweight, standalone, executable package of software that includes everything needed to run an application: code, runtime, and system tools.",
    "cloud microservices": "Microservices are an architectural style that structures a cloud application as a collection of small, independent, loosely coupled services communicating via APIs.",
    "sql query": "An SQL query is a structured text command used to request, sort, filter, or input data entries held within an organized relational database system.",
    "nosql collection": "A NoSQL collection is a structural gathering of data documents inside a non-relational database, functioning similarly to an un-mapped relational database table.",
    "game collision box": "A collision hitbox is an invisible geometric boundary drawn around a 2D or 3D sprite, used by physics engines to calculate intersections and block movements.",
    "game particle system": "A particle system is a graphics engine technique that uses a massive array of tiny, moving sprites to simulate chaotic fuzzy phenomena like fire, smoke, and explosions.",
    "parallax scrolling": "Parallax scrolling is a graphic rendering technique where background images move past the camera slower than foreground images, creating an illusion of 3D depth.",
    "frame rate": "Frame rate is the frequency at which consecutive graphic images called frames appear on a display screen, commonly measured in frames per second (FPS).",
    "john locke": "John Locke was an English philosopher and physician, widely regarded as one of the most influential of Enlightenment thinkers and known as the Father of Liberalism.",
    "jean jacques rousseau": "Jean-Jacques Rousseau was a Genevan philosopher whose political philosophy influenced the progress of the Age of Enlightenment throughout Europe and the French Revolution.",
    "magna carta": "The Magna Carta is a royal charter of rights agreed to by King John of England in 1215, establishing the foundational principle that everyone, including the king, is subject to the law.",
    "french revolution": "The French Revolution was a period of radical political and societal change in France that began in 1789, overturning the absolute monarchy and reshaping European law.",
    "american civil war": "The American Civil War was a civil war in the United States between the Union (the North) and the Confederacy (the South), lasting from 1861 to 1865.",
    "feudal system": "The feudal system was a combination of legal, economic, and military customs in medieval Europe that structured society around relationships derived from the holding of land.",
    "crusades": "The Crusades were a series of religious wars initiated, supported, and directed by the Latin Church in the medieval period, aimed at recovering the Holy Land from Islamic rule.",
        "colosseum": "The Colosseum is an ancient oval amphitheater in the center of the city of Rome, Italy. Built under the Flavian dynasty, it is the largest ancient amphitheater ever built and remains a premier symbol of the Roman Empire.",
    "chichen itza": "Chicuhen Itza was a large pre-Columbian city built by the Maya people of the Terminal Classic period. Located in Mexico, its massive stepped pyramid, El Castillo, highlights advanced Mayan astronomical alignments.",
    "petra": "Petra is a famous archaeological site in Jordan's southwestern desert, dating back to around 300 BC. Known as the 'Rose City,' it contains tombs, temples, and structures carved directly into vibrant pink sandstone cliff faces.",
    "statue of liberty": "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor, within New York City. A gift from the people of France to the United States, it represents a global symbol of freedom and democracy.",
    "grand canyon": "The Grand Canyon is a steep-sided canyon carved by the Colorado River in Arizona, United States. It exposes layers of ancient geological history, spanning nearly two billion years of the Earth's structural timeline.",
    "great barrier reef": "The Great Wall Barrier Reef is the world's largest coral reef system, composed of over 2,900 individual reefs stretching off the coast of Queensland, Australia. It is visible from outer space and supports a massive aquatic ecosystem.",
    "panama canal": "The Panama Canal is an artificial 82-kilometer waterway in Panama that connects the Atlantic Ocean with the Pacific Ocean, cutting across the Isthmus of Panama to serve as a conduit for international maritime trade.",
    "suez canal": "The Suez Canal is an artificial sea-level waterway in Egypt, connecting the Mediterranean Sea to the Red Sea through the Isthmus of Suez. It offers water vessels a direct navigation route between Europe and Asia without navigating around Africa.",
    "acropolis of athens": "The Acropolis of Athens is an ancient citadel located on a rocky outcrop above the city of Athens, Greece. It contains the remains of several ancient buildings of great architectural and historical significance, most famously the Parthenon.",
    "stonehenge": "Stonehenge is a prehistoric monument on Salisbury Plain in Wiltshire, England. It consists of an outer ring of vertical sarsen standing stones, originally erected around 2500 BC, aligned meticulously with the summer and winter solstices.",
    "louvre museum": "The Louvre is the world's largest art museum and a historic monument in Paris, France. A central landmark of the city, it houses thousands of classic pieces of artwork, including Leonardo da Vinci's Mona Lisa.",
    "kremlin": "The Moscow Kremlin is a fortified complex at the heart of Moscow, Russia, overlooking the Moskva River. It serves as the official residence of the President of the Russian Federation and stands as a historic symbol of state power.",
    "tajikistan": "Tajikistan is a landlocked, highly mountainous country in Central Asia. It is bordered by Afghanistan, Uzbekistan, Kyrgyzstan, and China, featuring the massive Pamir mountain range which spans across its eastern terrain.",
    "madagascar": "The island of Madagascar is a sovereign island country in the Indian Ocean, isolated off the eastern coast of East Africa. It is biodiversity hotspot, where over 90% of its native wildlife species are found nowhere else on Earth.",
    "greenland": "Greenland is the world's largest island, located between the Arctic and Atlantic oceans, east of the Canadian Arctic Archipelago. It is an autonomous territory within the Kingdom of Denmark, covered mostly by a massive ice sheet.",
    "sahara desert": "The Sahara is a massive desert on the African continent, holding the title of the largest hot desert in the world. It covers an area roughly equivalent to the entire landmass of the United States, stretching across North Africa.",
    "gobi desert": "The Gobi Desert is a large desert and semi-desert region in East Asia, covering parts of northern and northwestern China and southern Mongolia. It is a rain shadow desert, blocked from moisture by the massive Himalayan mountain range.",
    "mount kilimanjaro": "Mount Kilimanjaro is a dormant volcano located in Tanzania, Africa. It is the highest mountain in Africa and the highest single free-standing mountain above sea level in the world, rising 5,895 meters high.",
    "nile river": "The Nile is a major north-flowing river in northeastern Africa, historically considered one of the longest rivers in the world. It served as the lifeblood of ancient Egyptian civilization, providing fertile soil for early agriculture.",
    "mississippi river": "The Mississippi River is the primary river of the largest drainage system on the North American continent. Flowing entirely within the United States, it runs south for thousands of miles to empty into the Gulf of Mexico.",
    "andes mountains": "The Andes are the longest continental mountain range in the world, forming a continuous highland along the entire western coast of South America. They cross seven countries: Venezuela, Colombia, Ecuador, Peru, Bolivia, Chile, and Argentina.",
    "himalayas": "The Himalayas are a mountain range in Asia, separating the plains of the Indian subcontinent from the Tibetan Plateau. The range contains many of Earth's highest peaks, including the absolute highest, Mount Everest.",
    "photosynthesis light reaction": "The light-dependent reactions of photosynthesis occur in the thylakoid membranes of chloroplasts, capturing solar energy from photons to produce ATP and NADPH while splitting water molecules to release oxygen.",
    "calvin cycle": "The Calvin cycle is the set of chemical reactions that take place in the stroma of chloroplasts during photosynthesis. It is light-independent, using ATP and NADPH to fix carbon dioxide into organic sugar molecules like glucose.",
    "cellular respiration": "Cellular respiration is a set of metabolic reactions and processes that take place in the cells of organisms to convert chemical energy from nutrients into adenosine triphosphate (ATP), releasing waste products.",
    "glycolysis": "Glycolysis is a metabolic pathway that breaks down glucose into pyruvate, releasing a net total of two molecules of ATP and two molecules of NADH. It takes place in the cytosol of cells and does not require oxygen.",
    "krebs cycle": "The Krebs cycle, or citric acid cycle, is a series of chemical reactions used by all aerobic organisms to generate energy through the oxidation of acetate derived from carbohydrates, fats, and proteins into carbon dioxide.",
    "atp molecule": "Adenosine triphosphate (ATP) is an organic compound and hydrotrope that provides energy to drive many processes in living cells, such as muscle contraction, nerve impulse propagation, and chemical synthesis.",
    "homeostasis": "Homeostasis is the state of steady internal, physical, and chemical conditions maintained by living systems. This dynamic state of equilibrium is monitored by internal regulatory mechanisms despite changing external conditions.",
    "osmosis": "Osmosis is the spontaneous net movement or diffusion of solvent molecules through a selectively permeable membrane into a region of higher solute concentration, aiming to equalize the solute concentrations on both sides.",
    "diffusion": "Diffusion is the net movement of anything from a region of higher concentration to a region of lower concentration, driven by a gradient in chemical potential or random thermal kinetic motion of molecules.",
    "active transport": "Active transport is the movement of ions or molecules across a cell membrane into a region of higher concentration, assisted by enzymes and requiring the expenditure of cellular energy in the form of ATP.",
    "mitochondrion": "A mitochondrion is a double-membrane-bound organelle found in most eukaryotic organisms. They generate most of the cell's supply of adenosine triphosphate (ATP), earning them the title of the powerhouse of the cell.",
    "nucleus": "The cell nucleus is a membrane-bound organelle found in eukaryotic cells. It contains the majority of the cell's genetic material, organized as DNA molecules, and coordinates functions like growth and reproduction.",
    "ribosome": "A ribosome is a complex macromolecular machine, found within all living cells, that serves as the primary site of biological protein synthesis by linking amino acids together based on genetic instructions.",
    "chloroplast": "A chloroplast is a specialized organelle found within plant and algal cells. They contain a high concentration of the green pigment chlorophyll, which captures sunlight to conduct the process of photosynthesis.",
    "natural selection": "Natural selection is the differential survival and reproduction of individuals due to differences in phenotype. It is a key mechanism of evolution, driving adaptation over generations as favorable traits are passed on.",
    "mutation": "In biology, a mutation is an alteration in the nucleic acid sequence of the genome of an organism, virus, or extrachromosomal DNA, introducing genetic variations that serve as the raw material for evolutionary change.",
    "speciation": "Speciation is the evolutionary process by which populations evolve to become distinct biological species. It occurs when populations within a species become reproductively isolated from one another due to geographic or genetic changes.",
    "ecosystem dynamic": "An ecosystem is a community of living organisms in conjunction with the nonliving components of their environment, interacting as a structural system through nutrient cycles and energy flow configurations.",
    "food web": "A food web is the natural interconnection of food chains and a graphical representation of what-eats-what in an ecological community, charting the directional flow of nutritional energy through an ecosystem.",
    "trophic level": "The trophic level of an organism is the position it occupies in a food web. Producers sit at level 1, herbivores at level 2, carnivores at level 3, and apex predators sit at the highest levels of the system.",
    "carbon cycle": "The carbon cycle is the biogeochemical cycle by which carbon is exchanged among the biosphere, pedosphere, geosphere, hydrosphere, and atmosphere of Earth, helping to regulate global temperatures and recycle life components.",
    "nitrogen cycle": "The nitrogen cycle is the biogeochemical cycle by which nitrogen is converted into multiple chemical forms as it circulates among atmosphere, terrestrial, and marine ecosystems, aided heavily by bacterial fixation.",
    "water cycle": "The water cycle, or hydrologic cycle, describes the continuous movement of water on, above and below the surface of the Earth, changing states between liquid, vapor, and solid ice across a global matrix.",
    "greenhouse effect": "The greenhouse effect is the process by which radiation from a planet's atmosphere warms the planet's surface to a temperature above what it would be without this atmosphere, driven by greenhouse gases trapping infrared heat.",
    "biodiversity": "Biodiversity is the variety and variability of life on Earth. It is a measure of variation at the genetic, species, and ecosystem level, serving as a critical indicator of the overall health of a biological environment.",
    "symbiosis": "Symbiosis is any type of a close and long-term biological interaction between two different biological organisms, which can be mutualistic (both benefit), commensalistic (one benefits), or parasitic (one is harmed).",
    "keystone species": "A keystone species is a species that has a disproportionately large effect on its natural environment relative to its abundance, maintaining the structural integrity and biodiversity of its ecosystem ecosystem grid.",
    "carrying capacity": "The carrying capacity of an environment is the maximum population size of a biological species that can be sustained indefinitely in that specific environment, given the food, habitat, water, and other available resources.",
    "supply and demand": "In economics, supply and demand is an economic model of price determination in a market. It postulates that, holding all else equal, the unit price for a specific good will settle at a point where quantity demanded equals quantity supplied.",
    "gross domestic product": "Gross Domestic Product (GDP) is a monetary measure of the market value of all the final goods and services produced in a specific time period by a country, serving as a primary indicator of economic health.",
    "monetary policy": "Monetary policy is the policy adopted by the monetary authority of a nation, typically a central bank, to control either the interest rate payable on very short-term borrowing or the money supply to ensure financial stability.",
    "fiscal policy": "Fiscal policy is the use of government revenue collection (taxation) and expenditure (spending) to influence a nation's economy, serving alongside monetary policy to manage economic cycles and stability markers.",
    "opportunity cost": "In microeconomic theory, the opportunity cost of a particular activity choice is the value or benefit given up by choosing not to engage in the next best alternative activity available.",
    "comparative advantage": "In economics, comparative advantage refers to the ability of an economic agent to produce a specific good or service at a lower opportunity cost than its trade competitors, driving international trade structures.",
    "market equilibrium": "Economic equilibrium is a situation in a market scenario where economic forces such as supply and demand are balanced, and in the absence of external influences, the values of economic variables will not change.",
    "capitalism": "Capitalism is an economic system based on the private ownership of the means of production and their operation for profit. Central characteristics include capital accumulation, competitive markets, and voluntary exchange.",
    "socialism": "Socialism is an economic and political philosophy encompassing a range of economic systems characterized by social ownership of the means of production, as opposed to private ownership structures.",
    "communism": "Communism is a political and economic ideology that positions itself in opposition to liberal democracy and capitalism, advocating for a classless system in which the means of production are owned communally.",
    "classical mechanics": "Classical mechanics is a physical theory describing the motion of macroscopic objects, from projectiles to machinery, and astronomical objects, such as spacecraft, planets, stars, and galaxies under forces.",
    "kinematics": "Classical kinematics is a branch of classical mechanics that describes the motion of points, bodies, and systems of bodies without consideration of the masses of those bodies or the physical forces that caused the motion.",
    "dynamics": "In physics, dynamics is the branch of classical mechanics that is concerned with the study of forces and their specific effects on the motion of physical bodies and material systems.",
    "newtons first law": "Newton's first law of motion states that an object at rest remains at rest, and an object in motion remains in motion at a constant velocity, unless acted upon by a net external force.",
    "newtons second law": "Newton's second law of motion states that the acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass, mathematically expressed as Force equals mass times acceleration.",
    "newtons third law": "Newton's third law of motion states that when one body exerts a force on a second body, the second body simultaneously exerts a force equal in magnitude and opposite in direction on the first body.",
    "work physics": "In physics, work is the energy transferred to or from an object via the application of force along a displacement vector. In its simplest form, it is calculated as the product of the force magnitude and the distance moved.",
    "power physics": "In physics, power is the amount of energy transferred or converted per unit time. In the International System of Units, the unit of power is the watt, which is equivalent to one joule per second.",
    "conservation of energy": "The law of conservation of energy states that the total energy of an isolated system remains constant; it is said to be conserved over time. Energy can neither be created nor destroyed; rather, it can only be transformed.",
    "wave amplitude": "The amplitude of a periodic variable wave is a measure of its change over a single period, representing the maximum absolute displacement of the wave from its baseline equilibrium position.",
    "wave frequency": "Frequency is the number of occurrences of a repeating event per unit of time, representing the total number of wave crests that pass a fixed point within a single second interval.",
    "wavelength": "Wavelength is the distance between identical points (adjacent crests) in the adjacent cycles of a waveform signal propagated through space or a material medium, inversely proportional to frequency.",
    "wave period": "The period of a wave is the time it takes for a complete cycle of the wave to pass a fixed point in geometric space, mathematically calculated as the inverse of the wave frequency.",
    "electromagnetic spectrum": "The electromagnetic spectrum is the range of frequencies of electromagnetic radiation and their respective wavelengths, spanning from low-frequency radio waves to ultra-high-frequency gamma rays.",
    "radio waves": "Radio waves are a type of electromagnetic radiation with wavelengths in the electromagnetic spectrum longer than infrared light, frequently used to transfer data across communications networks.",
    "microwaves": "Microwaves are a form of electromagnetic radiation with wavelengths ranging from about one meter to one millimeter, commonly used for radar operations, wireless networks, and thermal cooking appliances."

};
function logMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', `${sender}-message`);
    msg.innerHTML = text.replace(/\n/g, '<br>');
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateStatus(text, className) {
    statusBadge.innerText = text;
    statusBadge.className = className;
}

function cleanPhrase(str) {
    return str.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

function getAnswerFromMemory(question) {
    const memory = JSON.parse(localStorage.getItem('agent_brain')) || {};
    const key = cleanPhrase(question);
    return memory[key] || null;
}

function saveAnswerToMemory(question, answer) {
    const memory = JSON.parse(localStorage.getItem('agent_brain')) || {};
    const key = cleanPhrase(question);
    memory[key] = answer;
    localStorage.setItem('agent_brain', JSON.stringify(memory));
}

// 🧮 AUTOMATED MATHEMATICAL PROBLEM SOLVING ENGINE
function evaluateMathProblem(inputString) {
    // 1. Sanitize the string to isolate equation components safely
    let cleanEquation = inputString.replace(/solve|calculate|compute|compute/gi, '')
                                   .replace(/[^0-9\+\-\*\/\(\)\. ]/g, '')
                                   .trim();
    
    if (cleanEquation.length === 0) return null;

    try {
        // 2. Perform step-by-step local sandboxed math parsing
        const computeResult = Function(`"use strict"; return (${cleanEquation})`)();
        
        if (typeof computeResult === 'number' && !isNaN(computeResult)) {
            return `🧮 **Mathematical Resolution Engine**:\n\n` +
                   `• **Problem Provided:** \`${cleanEquation}\`\n` +
                   `• **Step-by-Step Evaluation:** Running mathematical stack...\n` +
                   `• **Final Solution Value:** ==**${computeResult}**==`;
        }
    } catch (e) {
        return null; // Slipping to fallback dictionary if evaluation parsing errors out
    }
    return null;
}

// SIMULATED AUTO-TRAINER ENGINE
function runSimulatedAutoTrain() {
    let count = 0;
    for (const [topic, info] of Object.entries(GLOBAL_KNOWLEDGE_BASE)) {
        saveAnswerToMemory(topic, info);
        count++;
    }
    logMessage(`🚀 **Autonomous Engine Active**: Loading clean data packages...`, "system");
    Object.keys(GLOBAL_KNOWLEDGE_BASE).forEach((topic, index) => {
        setTimeout(() => { logMessage(`✅ **Logged**: "${topic}"`, "agent"); }, (index + 1) * 100);
    });
    setTimeout(() => {
        logMessage(`🎉 **Training Complete!** Offline architecture verified with exactly **${count}** un-multiplied records.`, "agent");
        updateStatus("Idle", "status-idle");
        isAutoCrawling = false;
        autotrainBtn.innerText = "⚡ Auto-Train Agent";
        autotrainBtn.style.backgroundColor = "#10b981";
    }, (Object.keys(GLOBAL_KNOWLEDGE_BASE).length + 1) * 100);
}

autotrainBtn.addEventListener('click', () => {
    if (isAutoCrawling) return;
    isAutoCrawling = true;
    autotrainBtn.innerText = "Training...";
    autotrainBtn.style.backgroundColor = "#ea580c";
    updateStatus("Crawling...", "status-working");
    runSimulatedAutoTrain();
});

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('agent_brain');
    logMessage("🗑️ Brain storage fully cleared.", "system");
});

exportBtn.addEventListener('click', () => {
    const memory = localStorage.getItem('agent_brain') || "{}";
    const blob = new Blob([memory], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "math_agent_brain.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    logMessage("📤 Export generated successfully!", "system");
});

// UPGRADED CHAT DISPATCH ROUTER
// 🎮 DYNAMIC INTERACTIVE GAME CODE GENERATION ENGINE
function generateDynamicGameCode(gameType, action1, action2) {
    return `🎮 **Autonomous Game Template Generated!**\n` +
           `Here is a custom standalone HTML5 starter template for your **${gameType}** game featuring **${action1}** and **${action2}**:\n\n` +
           `\`\`\`html\n` +
           `<!DOCTYPE html>\n` +
           `<html>\n` +
           `<head>\n` +
           `    <title>Custom ${gameType} Game</title>\n` +
           `    <style>canvas { background: #111; display: block; margin: 0 auto; }</style>\n` +
           `</head>\n` +
           `<body>\n` +
           `    <canvas id="gameCanvas" width="600" height="400"></canvas>\n` +
           `    <script>\n` +
           `        const canvas = document.getElementById("gameCanvas");\n` +
           `        const ctx = canvas.getContext("2d");\n\n` +
           `        // Game Object Tracking States\n` +
           `        let player = { x: 50, y: 300, width: 32, height: 32, speed: 5 };\n` +
           `        let keys = {};\n\n` +
           `        // Active Event Listeners tracking actions\n` +
           `        window.addEventListener("keydown", e => keys[e.key] = true);\n` +
           `        window.addEventListener("keyup", e => keys[e.key] = false);\n\n` +
           `        // Logic Pipeline for action: "${action1}"\n` +
           `        function handleActionOne() {\n` +
           `            // Custom mechanics placeholder for ${action1}\n` +
           `        }\n\n` +
           `        // Logic Pipeline for action: "${action2}"\n` +
           `        function handleActionTwo() {\n` +
           `            // Custom mechanics placeholder for ${action2}\n` +
           `        }\n\n` +
           `        // Primary Core Loop Engine\n` +
           `        function gameLoop() {\n` +
           `            ctx.clearRect(0, 0, canvas.width, canvas.height);\n\n` +
           `            // Render Player Sprite\n` +
           `            ctx.fillStyle = "#3b82f6";\n` +
           `            ctx.fillRect(player.x, player.y, player.width, player.height);\n\n` +
           `            handleActionOne();\n` +
           `            handleActionTwo();\n\n` +
           `            requestAnimationFrame(gameLoop);\n` +
           `        }\n` +
           `        gameLoop();\n` +
           `    <\/script>\n` +
           `</body>\n` +
           `</html>\n` +
           `\`\`\``;
}

// UPGRADED CHAT DISPATCH ROUTER (Intercepts prompt patterns)
// DYNAMIC INTERACTIVE GAME CODE GENERATION ENGINE
function generateDynamicGameCode(gameType, action1, action2) {
    return `🎮 **Autonomous Game Template Generated!**\n` +
           `Here is a custom standalone HTML5 starter template for your **${gameType}** game featuring **${action1}** and **${action2}**:\n\n` +
           `\`\`\`html\n` +
           `<!DOCTYPE html>\n` +
           `<html>\n` +
           `<head>\n` +
           `    <title>Custom ${gameType} Game</title>\n` +
           `    <style>canvas { background: #111; display: block; margin: 0 auto; }</style>\n` +
           `</head>\n` +
           `<body>\n` +
           `    <canvas id="gameCanvas" width="600" height="400"></canvas>\n` +
           `    <script>\n` +
           `        const canvas = document.getElementById("gameCanvas");\n` +
           `        const ctx = canvas.getContext("2d");\n\n` +
           `        // Game Object Tracking States\n` +
           `        let player = { x: 50, y: 300, width: 32, height: 32, speed: 5 };\n` +
           `        let keys = {};\n\n` +
           `        // Active Event Listeners tracking actions\n` +
           `        window.addEventListener("keydown", e => keys[e.key] = true);\n` +
           `        window.addEventListener("keyup", e => keys[e.key] = false);\n\n` +
           `        // Logic Pipeline for action: "${action1}"\n` +
           `        function handleActionOne() {\n` +
           `            // Custom mechanics placeholder for ${action1}\n` +
           `        }\n\n` +
           `        // Logic Pipeline for action: "${action2}"\n` +
           `        function handleActionTwo() {\n` +
           `            // Custom mechanics placeholder for ${action2}\n` +
           `        }\n\n` +
           `        // Primary Core Loop Engine\n` +
           `        function gameLoop() {\n` +
           `            ctx.clearRect(0, 0, canvas.width, canvas.height);\n\n` +
           `            // Render Player Sprite\n` +
           `            ctx.fillStyle = "#3b82f6";\n` +
           `            ctx.fillRect(player.x, player.y, player.width, player.height);\n\n` +
           `            handleActionOne();\n` +
           `            handleActionTwo();\n\n` +
           `            requestAnimationFrame(gameLoop);\n` +
           `        }\n` +
           `        gameLoop();\n` +
           `    <\/script>\n` +
           `</body>\n` +
           `</html>\n` +
           `\`\`\``;
}

// FIXED UN-BREAKABLE DISPATCH ROUTER WITH TOKEN SYSTEM
function processChatMessage() {
    // ALWAYS INITIALIZE THE CLOCK CHECK FIRST
    checkAndResetDailyTokens();

    const rawInput = userInput.value.trim();
    if (!rawInput) return;

    // LAYER 0: TOKEN BALANCE VALIDATION GATE
    if (tokenBalance <= 0) {
        logMessage("❌ **Out of Tokens**: You have exhausted your daily 50 token balance allowance.\n\n💡 *Hint: Press numeric keys 6 and 7 together to open the system recharge dashboard panel.*", "agent");
        userInput.value = '';
        return;
    }

    // Spend exactly 1 token to pass through and run your engine logic
    tokenBalance--;
    localStorage.setItem('agent_tokens', tokenBalance);
    updateStatus(`Tokens: ${tokenBalance}`, "status-idle");

    logMessage(rawInput, 'user');
    userInput.value = '';

    if (isTrainingMode) {
        saveAnswerToMemory(temporaryQuestion, rawInput);
        logMessage(`🧠 Taught successfully!`, "agent");
        isTrainingMode = false;
        return;
    }

    // 🕵️‍♂️ HIDDEN OVERRIDE LAYER: Checks for secret debug formula structure -> /db: key = value
    if (rawInput.toLowerCase().startsWith('/db:')) {
        const bodyContent = rawInput.substring(4).trim();
        const splitTokens = bodyContent.split('=');
        
        if (splitTokens.length >= 2) {
            const secretKey = splitTokens[0].trim().toLowerCase();
            const secretVal = splitTokens.slice(1).join('=').trim();
            
            if (secretKey && secretVal) {
                GLOBAL_KNOWLEDGE_BASE[secretKey] = secretVal;
                saveAnswerToMemory(secretKey, secretVal);
                
                const updatedCodeEntries = Object.entries(GLOBAL_KNOWLEDGE_BASE)
                    .map(([k, v]) => `    "${k.replace(/"/g, '\\"')}" : "${v.replace(/"/g, '\\"')}"`)
                    .join(",\n");
                
                logMessage(`🔧 **Secret Code Injection Confirmed**.\n\n` +
                           `• Key added: \`${secretKey}\`\n\n` +
                           `**Updated Code Block for your ai.js File:**\n` +
                           `\`\`\`javascript\nconst GLOBAL_KNOWLEDGE_BASE = {\n${updatedCodeEntries}\n};\n\`\`\``, "system");
                return;
            }
        }
        logMessage("❌ **Secret Syntax Error**: Use formula `/db: keyword = description text`", "system");
        return;
    }

    // Fixed Pattern Extraction Logic
    const gamePatternRegex = /how to make a\s+(.+?)\s+game\s+where\s+i\s+can\s+(.+?)\s+and\s+(.+)/i;
    const matchTokens = rawInput.match(gamePatternRegex);

    if (matchTokens) {
        const gameType = matchTokens[1].trim();
        const action1 = matchTokens[2].trim();
        const action2 = matchTokens[3].trim();
        
        const runtimeCodeMarkup = generateDynamicGameCode(gameType, action1, action2);
        logMessage(runtimeCodeMarkup, "agent");
        return;
    }

    // Math Processing Layer
    const problemSolutionText = evaluateMathProblem(rawInput);
    if (problemSolutionText) {
        logMessage(problemSolutionText, "agent");
        return;
    }

    // Knowledge Lookup Layer
    const savedKnowledge = getAnswerFromMemory(rawInput);
    if (savedKnowledge) {
        logMessage(savedKnowledge, "agent");
    } else {
        temporaryQuestion = rawInput;
        isTrainingMode = true;
        logMessage(`❌ Entry not found in local memory caches.\n\n🛠️ **[TRAIN MODE]**\nType a custom mapping response to train this specific string phrase.`, "agent");
    }
}

// ATTACH EVENT LISTENERS TO INTERFACE
sendBtn.addEventListener('click', processChatMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        processChatMessage();
    }
});

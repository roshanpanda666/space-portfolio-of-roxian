"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Variants for skill tile pop-in animation
const tileVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
      ease: "easeOut",
    },
  }),
};

// Skill tile component
const Skill = ({
  name,
  image,
  index,
}: {
  name: string;
  image: string;
  index: number;
}) => (
  <motion.div
    custom={index}
    variants={tileVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false }}
    className="flex flex-col justify-center items-center gap-2 bg-white/10 px-4 py-3 rounded-[16%] backdrop-blur-md hover:bg-white/20 transition shadow-md"
  >
    <img src={image} alt={name} className="w-10 h-10 object-contain" />
    <p className="text-white/90 text-sm font-medium text-center">{name}</p>
  </motion.div>
);

// Main Skills Section
export const Skills = () => {
  const fadeIn = (delay: number = 0) => ({
    whileInView: { opacity: 1, y: 0 },
    initial: { opacity: 0, y: 50 },
    transition: { duration: 0.6, delay },
  });

  const sectionClass = "w-[90%] max-w-6xl flex flex-col items-center gap-6";

  return (
    <section
      id="skills"
      className="flex flex-col justify-center items-center py-20 gap-32 overflow-hidden"
    >
      {/* Section Template */}
      {skillSections.map(({ title, skills }, sectionIndex) => (
        <motion.div
          key={title}
          {...fadeIn(sectionIndex * 0.2)}
          className={sectionClass}
        >
          <GradientHeading>{title}</GradientHeading>
          <SkillGrid>
            {skills.map(([name, image], index) => (
              <Skill key={name} name={name} image={image} index={index} />
            ))}
          </SkillGrid>
        </motion.div>
      ))}
    </section>
  );
};

// Gradient heading component
const GradientHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">
    {children}
  </h2>
);

// Grid wrapper
const SkillGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center items-center flex-wrap gap-7 mt-6">
    {children}
  </div>
);

// Skill section data 🔥
const skillSections = [
  {
    title: "🌐 Frontend",
    skills: [
      ["React", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"],
      ["Next.js", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"],
      ["TypeScript", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"],
      ["JavaScript", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"],
      ["Tailwind CSS", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"],
      ["HTML5", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"],
      ["CSS3", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"],
      ["Redux", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"],
      ["Framer Motion", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg"],
    ],
  },
  {
    title: "⚙️ Backend",
    skills: [
      ["Node.js", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"],
      ["Express.js", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"],
      ["Python", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"],
      ["Flask", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg"],
      ["FastAPI", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg"],
      ["PyMongo", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"],
      ["Mongoose", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongoose/mongoose-original.svg"],
      ["Socket.io", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg"],
      ["Inngest", "https://cdn.simpleicons.org/inngest/white"],
    ],
  },
  {
    title: "🖥️ GUI & Desktop Apps",
    skills: [
      ["Tkinter", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"],
      ["CustomTkinter", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"],
      ["PyQt", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/qt/qt-original.svg"],
    ],
  },
  {
    title: "📦 Databases & Auth",
    skills: [
      ["MongoDB", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"],
      ["Firebase", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg"],
      ["PostgreSQL", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"],
      ["ChromaDB", "https://cdn.simpleicons.org/chroma/white"],
      ["NextAuth", "https://authjs.dev/img/logo-sm.png"],
      ["JWT", "https://cdn.simpleicons.org/jsonwebtokens/white"],
    ],
  },
  {
    title: "🤖 AI & Machine Learning",
    skills: [
      ["LangChain", "https://cdn.simpleicons.org/langchain/white"],
      ["TensorFlow", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"],
      ["Scikit-learn", "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg"],
      ["OpenCV", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg"],
      ["MediaPipe", "https://cdn.simpleicons.org/mediapipe/white"],
      ["Pandas", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg"],
      ["NumPy", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"],
      ["Gemini API", "https://cdn.simpleicons.org/googlegemini/white"],
      ["Teachable Machine", "https://cdn.simpleicons.org/google/white"],
      ["HuggingFace", "https://huggingface.co/front/assets/huggingface_logo-noborder.svg"],
      ["YOLOv8", "https://cdn.simpleicons.org/ultralytics/white"],
      ["Matplotlib", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg"],
    ],
  },
  {
    title: "🔩 Hardware & IoT",
    skills: [
      ["Arduino", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg"],
      ["PyFirmata", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"],
      ["Raspberry Pi", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg"],
      ["ESP32", "https://cdn.simpleicons.org/espressif/white"],
      ["C++", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"],
    ],
  },
  {
    title: "🏗️ DevOps & Infrastructure",
    skills: [
      ["Docker", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"],
      ["Git", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"],
      ["GitHub", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"],
      ["Vercel", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg"],
      ["Nginx", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg"],
    ],
  },
  {
    title: "🧰 Tools & AI Assistants",
    skills: [
      ["Figma", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"],
      ["Photoshop", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg"],
      ["Canva", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg"],
      ["ChatGPT API", "https://cdn.simpleicons.org/openai/white"],
      ["Claude Code", "https://cdn.simpleicons.org/anthropic/white"],
      ["Gemini", "https://cdn.simpleicons.org/googlegemini/white"],
      ["Ollama", "https://cdn.simpleicons.org/ollama/white"],
      ["Lovable", "https://cdn.simpleicons.org/lovable/white"],
      ["Copilot", "https://cdn.simpleicons.org/githubcopilot/white"],
    ],
  },
];

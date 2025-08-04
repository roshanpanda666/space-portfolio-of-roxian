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
    viewport={{ once: true }}
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
      className="flex flex-col justify-center items-center py-20 gap-32"
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
    title: "Fullstack Development",
    skills: [
      ["Next.js", "https://alexraju.co.uk/assets/img/codeLogos/nextjs_logo.png"],
      ["React.js", "https://cdn.worldvectorlogo.com/logos/react-2.svg"],
      ["Tailwind CSS", "https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg"],
      ["HTML", "https://cdn.worldvectorlogo.com/logos/html-1.svg"],
      ["CSS", "https://cdn.worldvectorlogo.com/logos/css-3.svg"],
      ["JavaScript", "https://cdn.worldvectorlogo.com/logos/logo-javascript.svg"],
      ["Redux", "https://cdn.worldvectorlogo.com/logos/redux.svg"],
      ["Framer Motion", "https://cdn.worldvectorlogo.com/logos/framer-motion.svg"],
      ["Node.js", "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg"],
      ["Express.js", "https://www.pngfind.com/pngs/m/136-1363736_express-js-icon-png-transparent-png.png"],
      ["FastAPI", "https://cdn.worldvectorlogo.com/logos/fastapi.svg"],
      ["Mongoose", "https://cdn-icons-png.flaticon.com/512/5968/5968705.png"],
      ["MongoClient", "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg"],
      ["Pymongo", "https://sahilsehwag.wordpress.com/wp-content/uploads/2017/10/mongopython.png"],
      ["Socket.io", "https://cdn.worldvectorlogo.com/logos/socket-io.svg"],
      ["Python", "https://cdn.worldvectorlogo.com/logos/python-5.svg"],
    ],
  },
  {
    title: "AI & Machine Learning",
    skills: [
      ["OpenCV", "https://upload.wikimedia.org/wikipedia/commons/3/32/OpenCV_Logo_with_text_svg_version.svg"],
      ["MediaPipe", "https://chuoling.github.io/mediapipe/images/mediapipe_small.png"],
      ["TensorFlow", "https://cdn.worldvectorlogo.com/logos/tensorflow-2.svg"],
      ["Scikit-learn", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Scikit_learn_logo_small.svg/2560px-Scikit_learn_logo_small.svg.png"],
      ["HuggingFace", "https://avatars.githubusercontent.com/u/25720743?s=280&v=4"],
      ["LangChain", "https://images.seeklogo.com/logo-png/61/1/langchain-logo-png_seeklogo-611654.png"],
      ["ChromaDB", "https://www.trychroma.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fchroma.d840f629.png&w=1920&q=75&dpl=dpl_ECw2nT1AmCrWFsS29MaaMfNbSMUf"],
      ["YOLOv8", "https://cdn.prod.website-files.com/680a070c3b99253410dd3dcf/680a070c3b99253410dd3e8d_UltralyticsYOLO_mark_blue.svg"],
      ["Pandas", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCpCB6Du8H6Lrm5WIbDcdW59uqoSiL-eeTlw&s"],
      ["Matplotlib", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Created_with_Matplotlib-logo.svg/2048px-Created_with_Matplotlib-logo.svg.png"],
      ["NLTK", "https://miro.medium.com/v2/resize:fit:592/1*YM2HXc7f4v02pZBEO8h-qw.png"],
      ["Teachable Machine", "https://miro.medium.com/v2/resize:fit:600/0*2E9-J5WPFbVI_d32"],
    ],
  },
  {
    title: "IoT",
    skills: [
      ["C++", "https://cdn.worldvectorlogo.com/logos/c.svg"],
      ["PyFirmata", "https://media.licdn.com/dms/image/v2/C5612AQFjxSAcmEb6Hw/article-cover_image-shrink_600_2000/0/1520225888352?e=2147483647&v=beta&t=G8oY30Ri_YrZo12FCua7mQVwW2yvSbz4eEqowYtV7zc"],
      ["Arduino", "https://cdn.worldvectorlogo.com/logos/arduino-1.svg"],
      ["Raspberry Pi", "https://cdn.worldvectorlogo.com/logos/raspberry-pi.svg"],
    ],
  },
  {
    title: "Database",
    skills: [
      ["Firebase", "https://cdn.worldvectorlogo.com/logos/firebase-1.svg"],
      ["MongoDB", "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg"],
    ],
  },
  {
    title: "Authentication",
    skills: [
      ["JWT", "https://images.seeklogo.com/logo-png/42/1/jwt-logo-png_seeklogo-428033.png"],
      ["Auth.js", "https://avatars.githubusercontent.com/u/67470890?s=280&v=4"],
    ],
  },
  {
    title: "Desktop Apps",
    skills: [
      ["Tkinter", "https://i.ytimg.com/vi/hBMU-GD22TI/hqdefault.jpg"],
      ["CustomTkinter", "https://styles.redditmedia.com/t5_8tx64t/styles/communityIcon_kbz7e49k7obb1.png"],
    ],
  },
  {
    title: "Tools",
    skills: [
      ["Figma", "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg"],
      ["Canva", "https://cdn.worldvectorlogo.com/logos/canva-1.svg"],
      ["ChatGPT", "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"],
      ["Claude", "https://pub-4271c874f759418fbdcd18b0e5cbe024.r2.dev/Claude/claude-logo.png"],
      ["Copilot", "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-copilot-icon.png"],
    ],
  },
];

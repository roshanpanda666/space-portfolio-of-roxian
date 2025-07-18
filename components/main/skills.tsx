"use client";
import { motion } from "framer-motion";

export const Skills = () => {
  return (
    <section
      id="skills"
      className="flex flex-col justify-center items-center py-20 gap-32"
    >
      {/* Fullstack Development */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="w-[90%] max-w-6xl flex flex-col items-center gap-6"
      >
        <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">
          Fullstack Development
        </h2>
        <div className="flex justify-center items-center flex-wrap gap-7 mt-6">
          <Skill name="Next.js" image="https://alexraju.co.uk/assets/img/codeLogos/nextjs_logo.png" />
          <Skill name="React.js" image="https://cdn.worldvectorlogo.com/logos/react-2.svg" />
          <Skill name="Tailwind CSS" image="https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg" />
          <Skill name="HTML" image="https://cdn.worldvectorlogo.com/logos/html-1.svg" />
          <Skill name="CSS" image="https://cdn.worldvectorlogo.com/logos/css-3.svg" />
          <Skill name="JavaScript" image="https://cdn.worldvectorlogo.com/logos/logo-javascript.svg" />
          <Skill name="Redux" image="https://cdn.worldvectorlogo.com/logos/redux.svg" />
          <Skill name="Framer Motion" image="https://cdn.worldvectorlogo.com/logos/framer-motion.svg" />
          <Skill name="Node.js" image="https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" />
          <Skill name="Express.js" image="https://www.pngfind.com/pngs/m/136-1363736_express-js-icon-png-transparent-png.png" />
          <Skill name="FastAPI" image="https://cdn.worldvectorlogo.com/logos/fastapi.svg" />
          <Skill name="Mongoose" image="https://cdn-icons-png.flaticon.com/512/5968/5968705.png" />
          <Skill name="MongoClient" image="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" />
          <Skill name="Pymongo" image="https://sahilsehwag.wordpress.com/wp-content/uploads/2017/10/mongopython.png" />
          <Skill name="Socket.io" image="https://cdn.worldvectorlogo.com/logos/socket-io.svg" />
          <Skill name="Python" image="https://cdn.worldvectorlogo.com/logos/python-5.svg" />
        </div>
      </motion.div>

      {/* AI & Machine Learning */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-[90%] max-w-6xl flex flex-col items-center gap-6"
      >
        <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">
          AI & Machine Learning
        </h2>
        <div className="flex justify-center items-center flex-wrap gap-7 mt-6">
          <Skill name="OpenCV" image="https://upload.wikimedia.org/wikipedia/commons/3/32/OpenCV_Logo_with_text_svg_version.svg" />
          <Skill name="MediaPipe" image="https://chuoling.github.io/mediapipe/images/mediapipe_small.png" />
          <Skill name="TensorFlow" image="https://cdn.worldvectorlogo.com/logos/tensorflow-2.svg" />
          <Skill name="Scikit-learn" image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Scikit_learn_logo_small.svg/2560px-Scikit_learn_logo_small.svg.png" />
          <Skill name="HuggingFace" image="https://avatars.githubusercontent.com/u/25720743?s=280&v=4" />
          <Skill name="LangChain" image="https://images.seeklogo.com/logo-png/61/1/langchain-logo-png_seeklogo-611654.png" />
          <Skill name="ChromaDB" image="https://www.trychroma.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fchroma.d840f629.png&w=1920&q=75&dpl=dpl_ECw2nT1AmCrWFsS29MaaMfNbSMUf" />
          <Skill name="YOLOv8" image="https://cdn.prod.website-files.com/680a070c3b99253410dd3dcf/680a070c3b99253410dd3e8d_UltralyticsYOLO_mark_blue.svg" />
          <Skill name="Pandas" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCpCB6Du8H6Lrm5WIbDcdW59uqoSiL-eeTlw&s" />
          <Skill name="Matplotlib" image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Created_with_Matplotlib-logo.svg/2048px-Created_with_Matplotlib-logo.svg.png" />
          <Skill name="NLTK" image="https://miro.medium.com/v2/resize:fit:592/1*YM2HXc7f4v02pZBEO8h-qw.png" />
          <Skill name="Teachable Machine" image="https://miro.medium.com/v2/resize:fit:600/0*2E9-J5WPFbVI_d32" />
        </div>
      </motion.div>

      {/* IoT */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-[90%] max-w-6xl flex justify-center flex-col items-center gap-6"
      >
        <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">IoT</h2>
        <div className="flex justify-center items-center flex-wrap gap-7 mt-6">
          <Skill name="C++" image="https://cdn.worldvectorlogo.com/logos/c.svg" />
          <Skill name="PyFirmata" image="https://media.licdn.com/dms/image/v2/C5612AQFjxSAcmEb6Hw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520225888352?e=2147483647&v=beta&t=G8oY30Ri_YrZo12FCua7mQVwW2yvSbz4eEqowYtV7zc" />
          <Skill name="Arduino" image="https://cdn.worldvectorlogo.com/logos/arduino-1.svg" />
          <Skill name="Raspberry Pi" image="https://cdn.worldvectorlogo.com/logos/raspberry-pi.svg" />
        </div>
      </motion.div>

      {/* Database */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-[90%] max-w-6xl flex flex-col items-center gap-6"
      >
        <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">Database</h2>
        <div className="flex justify-center items-center flex-wrap gap-7 mt-6">
          <Skill name="Firebase" image="https://cdn.worldvectorlogo.com/logos/firebase-1.svg" />
          <Skill name="MongoDB" image="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" />
        </div>
      </motion.div>

      {/* Authentication */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="w-[90%] max-w-6xl flex flex-col items-center gap-6"
      >
        <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">Authentication</h2>
        <div className="flex justify-center items-center flex-wrap gap-7 mt-6">
          <Skill name="JWT" image="https://images.seeklogo.com/logo-png/42/1/jwt-logo-png_seeklogo-428033.png" />
          <Skill name="Auth.js" image="https://avatars.githubusercontent.com/u/67470890?s=280&v=4" />
        </div>
      </motion.div>

      {/* Desktop Apps */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="w-[90%] max-w-6xl flex flex-col items-center gap-6"
      >
        <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">Desktop Apps</h2>
        <div className="flex justify-center items-center flex-wrap gap-7 mt-6">
          <Skill name="Tkinter" image="https://i.ytimg.com/vi/hBMU-GD22TI/hqdefault.jpg" />
          <Skill name="CustomTkinter" image="https://styles.redditmedia.com/t5_8tx64t/styles/communityIcon_kbz7e49k7obb1.png" />
        </div>
      </motion.div>

      {/* Tools */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="w-[90%] max-w-6xl flex flex-col items-center gap-6"
      >
        <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center">Tools</h2>
        <div className="flex justify-center items-center flex-wrap gap-7 mt-6">
          <Skill name="Figma" image="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" />
          <Skill name="Canva" image="https://cdn.worldvectorlogo.com/logos/canva-1.svg" />
          <Skill name="ChatGPT" image="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" />
          <Skill name="Claude" image="https://pub-4271c874f759418fbdcd18b0e5cbe024.r2.dev/Claude/claude-logo.png" />
          <Skill name="Copilot" image="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-copilot-icon.png" />
        </div>
      </motion.div>
    </section>
  );
};

const Skill = ({ name, image }: { name: string; image: string }) => (
  <div className="flex flex-col justify-center items-center gap-2 bg-white/10 px-4 py-3 rounded-[16%] backdrop-blur-md hover:bg-white/20 transition shadow-md">
    <img src={image} alt={name} className="w-10 h-10 object-contain" />
    <p className="text-white/90 text-sm font-medium text-center">{name}</p>
  </div>
);

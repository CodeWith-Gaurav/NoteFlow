import React, { useRef, useEffect } from "react";

const TiltImage = () => {
  const imgRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { left, top, width, height } = imgRef.current.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;

      imgRef.current.style.transform = `rotateX(${(-y / 20)}deg) rotateY(${x / 20}deg)`;
    };

    const handleMouseLeave = () => {
      imgRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    const element = imgRef.current;
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="w-80 h-80 perspective-1000">
      <img
        ref={imgRef}
        src="https://source.unsplash.com/600x600/?notes,study"
        alt="Hero"
        className="rounded-2xl shadow-2xl transition-transform duration-200 ease-out"
      />
    </div>
  );
};

export default TiltImage;

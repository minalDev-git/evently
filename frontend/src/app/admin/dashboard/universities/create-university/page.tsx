import CreateUniForm from "@/components/shared/CreateUniForm";
import React from "react";

const CreateUni = () => {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>
      <div className="wrapper">
        <CreateUniForm />
      </div>
    </>
  );
};

export default CreateUni;

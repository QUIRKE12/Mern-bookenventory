import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-24 py-16">
      <section className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-blue-700 mb-4">
          TURI BA NDE?
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Kaze muri <strong>GIGO BUSINESS COMPANY</strong>. Turi ishirahamwe
          ryihariye mu gukora no gukwiragiza ivyokunywa vy'ubwoko butandukanye.
          Dutanga ivyokunywa vyiza, vyizewe kandi ku giciro kibereye abakiriya
          bose. Intumbero yacu ni ugushikana ivyokunywa bikunzwe ku bantu bose
          mu buryo bworoshe kandi bwihuta.
        </p>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 mb-4">
          INTEGO YACU
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gutuma umukiriya aronka ivyokunywa yipfuza ku giciro ciza kandi hafi
          yiwe igihe cose.
        </p>
        <ul className="list-disc list-inside text-lg text-gray-600 mt-4 mx-auto max-w-2xl text-left">
          <li>Gutanga ivyokunywa vyiza kandi vyizewe.</li>
          <li>Gushikira abakiriya mu gihugu cose.</li>
          <li>Gutanga ibiciro vyiza kandi bibereye bose.</li>
          <li>Gutanga serivisi yihuta kandi y'umwizero.</li>
        </ul>
      </section>

      <section className="bg-blue-100 py-12 px-6 rounded-lg mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 text-center mb-8">
          KUKI WOHITAMWO GIGO BUSINESS COMPANY?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-700">IBICIRO VYIZA</h3>
            <p className="text-gray-600">
              Dutanga ivyokunywa ku biciro vyiza kandi bishoboka kuri bose.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-700">UBWOKO BUTANDUKANYE</h3>
            <p className="text-gray-600">
              Turafise ivyokunywa vyambiye n'ibitambiye vy'ubwoko bwinshi.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-700">GUTANGA VYIHUTA</h3>
            <p className="text-gray-600">
              Tumiza ivyo ukeneye maze tubishikane mu gihe gito.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-700">ICIZERE N'UMUTEKANO</h3>
            <p className="text-gray-600">
              Dukorana n'abakiriya bacu mu kuri, icizere no mu mutekano.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 mb-4">
          TWIFATANYE NAMWE
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          Ba umwe mu bakiriya n'abafatanyabikorwa ba
          <strong> GIGO BUSINESS COMPANY</strong>. Twama twiteguriye
          kubashikiriza ivyokunywa vyiza kandi ku giciro kibereye bose.
        </p>
        <button className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-800 transition-all duration-300">
          TANGURA NONAHA
        </button>
      </section>
    </div>
  );
};

export default About;

import React from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-24 py-16">
      <section className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-blue-700 mb-4">
          Kaze muri GIGO COMPANY LIMITED
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Hora uronka amakuru mashasha ku binyobwa vyacu, ibiciro bishasha,
          amananiza n'amatangazo atandukanye. Twibutsa bose kunywa mu rugero.
          Inzoga ntizemewe ku bana bari munsi y'imyaka 18 hamwe n'abakenyezi
          bibungenze.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 text-center mb-6">
          IBIHERUKA
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src="/assets/awar.png"
              alt="Ibinyobwa Bishasha"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              Ibinyobwa Bishasha
            </h3>
            <p className="text-gray-600 mb-4">
              Twakiriye ubwoko bushasha bw'ibinyobwa vyiza kandi bifise
              akanovera kadasanzwe. Sura amashami yacu yose ubironke.
            </p>
            <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold">
              Soma Vyinshi →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src="/assets/books.jpg"
              alt="Promotion"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              Amananiza Mashasha
            </h3>
            <p className="text-gray-600 mb-4">
              GIGO COMPANY LIMITED irabafitiye amananiza adasanzwe ku
              binyobwa bitandukanye. Ntucikwe ayo mahirwe.
            </p>
            <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold">
              Soma Vyinshi →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src="/assets/salvator.jpg"
              alt="Kunywa Mu Rugero"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              Kunywa Mu Rugero
            </h3>
            <p className="text-gray-600 mb-4">
              Turahamagarira abakiriya bose kunywa mu rugero no gukurikiza
              amategeko agenga ikoreshwa ry'inzoga.
            </p>
            <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold">
              Soma Vyinshi →
            </a>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 text-center mb-6">
          IBICE BITANDUKANYE
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-xl">
            Ibinyobwa Vyambiye
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-xl">
            Ibinyobwa Bitambiye
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-xl">
            Amananiza
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900 font-semibold text-xl">
            Amatangazo
          </a>
        </div>
      </section>

      <section className="bg-blue-100 py-12 text-center rounded-lg">
        <h2 className="text-3xl lg:text-4xl font-semibold text-blue-700 mb-4">
          Rondera Amakuru Mashasha
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          Iyandikishe kugira uronke amakuru mashasha ku binyobwa bishasha,
          amananiza n'amatangazo ya GIGO COMPANY LIMITED.
        </p>
        <input
          type="email"
          placeholder="Shiramwo Email Yawe"
          className="px-6 py-3 rounded-full w-2/3 sm:w-1/2 text-lg mb-4 border-2 border-gray-300"
        />
        <div>
          <button className="bg-blue-700 text-white px-8 py-3 rounded-full hover:bg-blue-800 transition-all duration-300">
            Iyandikishe
          </button>
        </div>
      </section>
    </div>
  );
};

export default Blog;

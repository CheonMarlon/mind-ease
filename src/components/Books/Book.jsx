import React, { useState } from 'react';
import Modal from 'react-modal';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import NaviMain from '../NaviMain/NaviMain';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './Book.css';

// Set the app element for accessibility (make sure it matches your root ID)
Modal.setAppElement('#root');

const Book = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  const books = [
    {
      title: "Book1",
      coverImage: "/assets/books/book-cover/ICYNT.png",
      pdfUrl: "/assets/books/book-pdf/ICYNT.pdf",
    },
    {
      title: "Book 2",
      coverImage: "/assets/books/book-cover/MYSTS.png",
      pdfUrl: "/assets/books/book-pdf/MYSTS.pdf",
    },
    {
      title: "Book 3",
      coverImage: "/assets/books/book-cover/ATOM.png",
      pdfUrl: "/assets/books/book-pdf/ATOM.pdf",
    },
    {
      title: "Book 4",
      coverImage: "/assets/books/book-cover/FEELG.png",
      pdfUrl: "/assets/books/book-pdf/FEELG.pdf",
    },
    {
      title: "Book 5",
      coverImage: "/assets/books/book-cover/IKFS.png",
      pdfUrl: "/assets/books/book-pdf/IKFS.pdf",
    },
    {
      title: "Book 6",
      coverImage: "/assets/books/book-cover/MSM.png",
      pdfUrl: "/assets/books/book-pdf/MSM.pdf",
    },
    {
      title: "Book 7",
      coverImage: "/assets/books/book-cover/MYE.png",
      pdfUrl: "/assets/books/book-pdf/MYE.pdf",
    },
    {
      title: "Book 8",
      coverImage: "/assets/books/book-cover/STOPOV.png",
      pdfUrl: "/assets/books/book-pdf/STOPOV.pdf",
    },
    {
      title: "Book 9",
      coverImage: "/assets/books/book-cover/STOW.png",
      pdfUrl: "/assets/books/book-pdf/STOW.pdf",
    },
    {
      title: "Book 10",
      coverImage: "/assets/books/book-cover/TBKS.png",
      pdfUrl: "/assets/books/book-pdf/TBKS.pdf",
    },
    {
      title: "Book 11",
      coverImage: "/assets/books/book-cover/WHNTMTB.png",
      pdfUrl: "/assets/books/book-pdf/WHNTMTB.pdf",
    },
    {
      title: "Book 12",
      coverImage: "/assets/books/book-cover/YNAL.png",
      pdfUrl: "/assets/books/book-pdf/YNAL.pdf",
    },
  ];

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleBookClick = (pdfUrl) => {
    console.log('Opening book:', pdfUrl);
    setSelectedBook(pdfUrl);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="book-container">
      <div className="nav-main">
        <NaviMain/>
      </div>
      <div className="bookground"></div>

      {/* React Modal PDF Viewer */}
      <Modal
        isOpen={!!selectedBook}
        onRequestClose={handleCloseModal}
        contentLabel="PDF Viewer"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <button className="close-btn" onClick={handleCloseModal}>✖</button>
        <Worker workerUrl="/pdf-worker/pdf.worker.min.js">
          <Viewer fileUrl={selectedBook} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </Modal>

      {/* Bookshelf background (optional) */}
      <div className="bookshelf-image"></div>

      {/* Top Books */}
      <div className="books-list top-books">
        {books.slice(0, 6).map((book, index) => (
          <div
            key={index}
            className="book-cover"
            style={{ backgroundImage: `url(${book.coverImage})` }}
            onClick={() => handleBookClick(book.pdfUrl)}
          >
            <h3>{book.title}</h3>
          </div>
        ))}
      </div>

      {/* Bottom Books */}
      <div className="books-list bottom-books">
        {books.slice(6).map((book, index) => (
          <div
            key={index}
            className="book-cover"
            style={{ backgroundImage: `url(${book.coverImage})` }}
            onClick={() => handleBookClick(book.pdfUrl)}
          >
            <h3>{book.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Book;

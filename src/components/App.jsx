import React, { useState, useEffect } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as message from './notification';
import { imagesApi } from './imagesApi';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';

export const App = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({});
  const [totalImage, setTotalImage] = useState(0);

  useEffect(() => {
    if (search === '') {
      return;
    }

    async function newSearchRequestServer() {
      try {
        const response = await imagesApi({ search, page });
        const totalImages = response.data.totalHits;
        const images = response.data.hits;

        if (totalImages === 0 || images === '') {
          return message.notificationError();
        }
        if (page === 1) {
          message.notificationSuccess(totalImages);
        }
        setImages(prevState => [...prevState, ...images]);
        setTotalImage(totalImages);
      } catch (error) {
        message.notificationServerError();
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    newSearchRequestServer();

    return () => {};
  }, [search, page]);

  const trackingSearch = evt => {
    evt.preventDefault();

    const form = evt.currentTarget;
    const searchValue = form.elements.search.value;

    if (searchValue.trim() === '') {
      return message.notificationInfo();
    }

    setSearch(searchValue);
    setPage(1);
    setImages([]);

    form.reset();
  };

  const openModal = evt => {
    setModal({ alt: evt.target.alt, url: evt.currentTarget.dataset.large });

    setShowModal(true);
  };

  const closeModal = evt => {
    setShowModal(false);
  };

  const loadMoreImages = () => {
    setPage(prevState => prevState + 1);
  };

  const maxPage = Math.ceil(totalImage / 12);
  const showButton = images.length > 0 && page < maxPage;

  return (
    <>
      <Searchbar onSubmit={trackingSearch} />
      <ImageGallery>
        {images.map(image => (
          <ImageGalleryItem key={image.id} image={image} onClick={openModal} />
        ))}
      </ImageGallery>
      {loading && <Loader />}
      {showButton && <Button onClick={loadMoreImages} />}
      {showModal && <Modal image={modal} onClose={closeModal} />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;

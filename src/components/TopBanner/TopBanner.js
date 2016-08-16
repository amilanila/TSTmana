import React, { PropTypes } from 'react';
import { Carousel } from 'react-bootstrap';

export const TopBanner = () => {
	return (
    <Carousel>
      <Carousel.Item>
        <img width={900} height={500} alt="900x500" src="/images/ball-and-bales.jpg"/>
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img width={900} height={500} alt="900x500" src="/images/world.png"/>
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
	);
};

export const propTypes = TopBanner.propTypes = {
	shouldPlaceOrder: PropTypes.bool
};

export default TopBanner;

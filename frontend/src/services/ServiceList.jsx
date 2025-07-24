import ServiceCard from './ServiceCard';
import { Col } from 'reactstrap';

import weatherImg from '../assets/images/weather.png';
import guideImg from '../assets/images/guide.png';
import customization from '../assets/images/customization.png';

const servicesDate = {
  services: [
    {
      id: 1,
      imgUrl: weatherImg,
      title: 'Weather',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 2,
      imgUrl: guideImg,
      title: 'Guide',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 3,
      imgUrl: customization,
      title: 'Customization',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ],
};

const ServiceList = () => {
  return (
    <>
      {servicesDate.services.map((service) => (
        <Col lg={3} key={service.id}>
          <ServiceCard item={service} />
        </Col>
      ))}
    </>
  );
};

export default ServiceList;

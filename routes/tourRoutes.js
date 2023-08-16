const express = require('express');

const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();
const reviewRouter = require('./../routes/reviewRoutes');

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);


router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
//-------------------------------- authController.protect
router.use(authController.protect);

router
  .route('/monthly-plan/:year')
  .get(
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );
//-------------------------------- restrictTo('admin', 'lead-guide')
  router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    tourController.deleteTour
  );

module.exports = router;

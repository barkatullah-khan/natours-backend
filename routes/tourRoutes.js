const express=require('express')
const tourController=require('./../controllers.js/tourController')


const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.alliasTopTours, tourController.getAllTours);

router
.route('/tour-stats').
get(tourController.getTourStates)

router
.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan)

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);
module.exports=router;
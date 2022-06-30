const EqSliders = ((parent) => {


  const sliderThumbSize = 20;
  const sliderHeight = 300;
  const svgViewBoxHeight = 100;
  const svgViewBoxThumbLimit = (sliderThumbSize / 2) * (svgViewBoxHeight / sliderHeight);
  const svgViewBoxGraphMax = svgViewBoxHeight - svgViewBoxThumbLimit;
  const svgViewBoxGraphMin = svgViewBoxThumbLimit;

  let ranges = {
    range1: null,
    range2: null,
    range3: null,
    range4: null,
    range5: null,
    range6: null,
    range7: null
  };
 
  let points = {
    begin: {
      x: 10,
      y: 0
    },
    point1: {
      x: 10,
      y: 0
    },
    control1: {
      x: 20,
      y: 10
    },
    control2: {
      x: 20,
      y: 0
    },
    point2: {
      x: 30,
      y: 0
    },
    control3: {
      x: 40,
      y: 0
    },
    point3: {
      x: 50,
      y: 0
    },
    control4: {
      x: 60,
      y: 0
    },
    point4: {
      x: 70,
      y: 0
    },
    control5: {
      x: 80,
      y: 0
    },
    point5: {
      x: 90,
      y: 0
    },
    control6: {
      x: 100,
      y: 0
    },
    point6: {
      x: 110,
      y: 0
    },
    control7: {
      x: 120,
      y: 0
    },
    point7: {
      x: 130,
      y: 0
    },
  };

  function mapDataRange(value) {


      
    return Math.floor(97- (((value - 0) * (svgViewBoxGraphMax - svgViewBoxGraphMin)) / (svgViewBoxHeight - 0)) + svgViewBoxGraphMin);
  }

  function updateSlider($element) {
    if ($element) {

      let rangeIndex = $element.getAttribute('data-slider-index'),
        range = ranges[rangeIndex],
        value = $element.value;

      if (range === value) {
        return; // No value change, no need to update then
      }
      // Update state
      ranges[rangeIndex] = value;

      let parent = $element.parentElement,
        $thumb = parent.querySelector('.range-slider-thumb'),
        $bar = parent.querySelector('.range-slider-bar'),
        pct = value * ((sliderHeight - sliderThumbSize) / sliderHeight)

      $thumb.style.bottom = `${pct}%`;
      $bar.style.height = `calc(${pct}% + ${sliderThumbSize/2}px)`;
      //$thumb.textContent = `${value}%`;

      renderSliderGraph();
    }
  }

  function updatePoints() {
    // Convert from percentage to coordinate values    
    // Calculate and floor the values
    points.point1.y = svgViewBoxHeight - (svgViewBoxHeight * (ranges.range1) / 100) | 0;
    points.point2.y = svgViewBoxHeight - (svgViewBoxHeight * (ranges.range2) / 100) | 0;
    points.point3.y = svgViewBoxHeight - (svgViewBoxHeight * (ranges.range3) / 100) | 0;
    points.point4.y = svgViewBoxHeight - (svgViewBoxHeight * (ranges.range4) / 100) | 0;
    points.point5.y = svgViewBoxHeight - (svgViewBoxHeight * (ranges.range5) / 100) | 0;
    points.point6.y = svgViewBoxHeight - (svgViewBoxHeight * (ranges.range6) / 100) | 0;
    points.point7.y = svgViewBoxHeight - (svgViewBoxHeight * (ranges.range7) / 100) | 0;

    const max = svgViewBoxGraphMax;
    const min = svgViewBoxGraphMin;

    points.point1.y = mapDataRange(points.point1.y);
    parent.filters[0].gain.value = ranges.range1/5

    points.point2.y = mapDataRange(points.point2.y);
  

    parent.filters[1].gain.value = ranges.range2/10

    points.point3.y = mapDataRange(points.point3.y);
    parent.filters[2].gain.value = ranges.range3/10

    points.point4.y = mapDataRange(points.point4.y);
    parent.filters[3].gain.value = ranges.range4/13;

    points.point5.y = mapDataRange(points.point5.y);
    parent.filters[4].gain.value = ranges.range5/13

    points.point6.y = mapDataRange(points.point6.y);
    parent.filters[5].gain.value = ranges.range6/13

    points.point7.y = mapDataRange(points.point7.y);
    parent.filters[6].gain.value = ranges.range7/13;


  }

 


  function renderSliderGraph() {
    updatePoints();
   
  }



  return {

    updateSlider,

  };

});

export default EqSliders;
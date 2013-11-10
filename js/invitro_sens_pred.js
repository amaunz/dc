runInvitroSensPred = function() {

  // init charts and data
  window.cancerTypeRingChart              = dc.rowChart("#cancer-type-chart")
  window.tumorModelRingChart              = dc.rowChart("#tumor-model-chart")
  window.compoundRingChart                = dc.rowChart("#compound-chart")
  window.modeOfActionRingChart            = dc.rowChart("#mode-of-action-chart")
  window.tumorModelAndCompoundHistChartX  = dc.barChart("#tumor-model-and-compound-hist-chart-x")
  window.tumorModelAndCompoundHistChartY  = dc.barChart("#tumor-model-and-compound-hist-chart-y")
  window.tumorModelAndCompoundBubbleChart = dc.bubbleChart("#tumor-model-and-compound-bubble-chart")
  
  // TODO: eliminate vals for 1 dim only from DATA!!!
  var cancerData = [
    {value: 40,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 38,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 35,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Vemurafenib'   , modeOfAction: 'Inhibitor'},
    {value: 41,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 62,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: '5-Fluorouracil', modeOfAction: 'Cell Poison'},
    {value: 110, dim: 'x', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Vemurafenib'   , modeOfAction: 'Inhibitor'},
    {value: 120, dim: 'x', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 110, dim: 'x', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 200, dim: 'x', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: '5-Fluorouracil', modeOfAction: 'Cell Poison'},
    {value: 3,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 4,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 4,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Vemurafenib'   , modeOfAction: 'Inhibitor'},
    {value: 3,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 4,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: '5-Fluorouracil', modeOfAction: 'Cell Poison'},
    {value: 8,   dim: 'y', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Vemurafenib'   , modeOfAction: 'Inhibitor'},
    {value: 12,  dim: 'y', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Cisplatin'     , modeOfAction: 'DNA Alkylation'},
    {value: 11,  dim: 'y', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: '5-Fluorouracil', modeOfAction: 'Cell Poison'},
  ];
  
  
  window.cancerData                     = addCountsForTumorModelAndCompound(cancerData)
  //console.log(cancerData)
  
  var cancerFacts                    = crossfilter(cancerData)
  
  // dimensions
  var cancerTypeDim                  = cancerFacts.dimension(function(d) {return d.cancerType  })
  var tumorModelDim                  = cancerFacts.dimension(function(d) {return d.tumorModel  })
  var compoundDim                    = cancerFacts.dimension(function(d) {return d.compound    })
  var modeOfActionDim                = cancerFacts.dimension(function(d) {return d.modeOfAction})
  var tmcdCountXDim                  = cancerFacts.dimension(function(d) {return d.tmcdCountX  })
  var tmcdCountYDim                  = cancerFacts.dimension(function(d) {return d.tmcdCountY  })
  var tumorModelAndCompoundDim       = cancerFacts.dimension(function(d) {return getTumorModelAndCompoundSelector(d)})
  
  // reduce-count
  var cancerTypeHist                 = cancerTypeDim                .group().reduceCount()
  var tumorModelHist                 = tumorModelDim                .group().reduceCount()
  var compoundHist                   = compoundDim                  .group().reduceCount()
  var modeOfActionHist               = modeOfActionDim              .group().reduceCount()
  var tmcdCountXHist                 = tmcdCountXDim                .group().reduceCount()
  var tmcdCountYHist                 = tmcdCountYDim                .group().reduceCount()
  
  // reduce-custom
  var tumorModelAndCompoundReduction = tumorModelAndCompoundDim.group().reduce(
    function (p,v) {
      if (v.dim == 'x') {
        ++p.countX
        p.sumX       += v.value
        p.avgX        = p.sumX / p.countX
      }
      if (v.dim == 'y') {
        ++p.countY
        p.sumY       += v.value
        p.avgY        = p.sumY / p.countY
      }
      p.label         = v.tumorModel + strSep() + v.compound 
      p.cancerType    = v.cancerType
      p.compound      = v.compound
      p.modeOfAction  = v.modeOfAction
      p.tmcdCountX    = v.tmcdCountX
      p.tmcdCountY    = v.tmcdCountY
      return p
    },
    function (p,v) {
      if (v.dim == 'x') {
        --p.countX
        p.sumX       -= v.value
        p.avgX        = p.sumX / p.countX
      }
      if (v.dim == 'y') {
        --p.countY
        p.sumY       -= v.value
        p.avgY        = p.sumY / p.countY
      }
      return p
    },
    function () {
      return({countX: 0, countY: 0, sumX: 0, avgX: 0, sumY: 0, avgY: 0, label: '', cancerType: '', tmcdCountX: 0, tmcdCountY: 0})
    }
  )
  
  
  //console.log('tmcdCountXDim.top(20)')
  //console.log(tmcdCountXDim.top(20))
  //console.log('tmcdCountXHist.all()')
  //console.log(tmcdCountXHist.all())
  //console.log('tmcdCountYDim.top(20)')
  //console.log(tmcdCountYDim.top(20))
  //console.log('tmcdCountYHist.all()')
  //console.log(tmcdCountYHist.all())
  
  // histogram
  var xlim = getTumorModelAndCompoundDimExtent(cancerData)
  //console.log(xlim)
  var xTicks = xlim[1]-xlim[0]+2
  console.log('xTicks')
  console.log(xTicks)
  xlim[0]-=1
  xlim[1]+=1
  
  var yTicksX=d3.max(tmcdCountXHist.all(), function(d) { return d.value/d.key })
  var yTicksY=d3.max(tmcdCountYHist.all(), function(d) { return d.value/d.key })
  var yTicks =d3.max([yTicksX, yTicksY])
  
  console.log('yTicks')
  console.log(yTicks)
  
  
  var barChartCommons = function(chart) {
    chart.centerBar(true)
         .gap(10)
         .brushOn(true)
         .renderHorizontalGridLines(true)
         .colors(d3.scale.linear().range(['#BBB','#DDD']))
    return(chart)
  }
  
  tumorModelAndCompoundHistChartX = barChartCommons(tumorModelAndCompoundHistChartX)
  tumorModelAndCompoundHistChartX
      .width(200).height(200)
      .dimension(tmcdCountXDim)
      .group(tmcdCountXHist)
      .x(d3.scale.linear().domain(xlim))
      .valueAccessor(function(d) {return d.value/d.key})
  tumorModelAndCompoundHistChartX
      .xAxis().tickFormat(function(v) {return Math.round(v)})
      .tickSubdivide(0)
      .ticks(xTicks)
  tumorModelAndCompoundHistChartX
      .yAxis().tickFormat(function(v) {return Math.round(v)})
      .tickSubdivide(0)
      .ticks(yTicks)
  
  tumorModelAndCompoundHistChartY = barChartCommons(tumorModelAndCompoundHistChartY)
  tumorModelAndCompoundHistChartY
      .width(200).height(200)
      .dimension(tmcdCountYDim)
      .group(tmcdCountYHist)
      .x(d3.scale.linear().domain(xlim))
      .valueAccessor(function(d) {return d.value/d.key})
  tumorModelAndCompoundHistChartY
      .xAxis().tickFormat(function(v) {return Math.round(v)})
      .tickSubdivide(0)
      .ticks(xTicks)
  tumorModelAndCompoundHistChartY
      .yAxis().tickFormat(function(v) {return Math.round(v)})
      .tickSubdivide(0)
      .ticks(yTicks)
  
  // cancer type
  cancerTypeRingChart
      .width(175).height(175)
      .dimension(cancerTypeDim)
      .group(cancerTypeHist)
      .colors(cancerDataColors)
  
  // tumor model
  tumorModelRingChart
      .width(175).height(480)
      .dimension(tumorModelDim)
      .group(tumorModelHist)
  
  // compound
  compoundRingChart
      .width(175).height(480)
      .dimension(compoundDim)
      .group(compoundHist)

  // mode of action
  modeOfActionRingChart
      .width(175).height(175)
      .dimension(modeOfActionDim)
      .group(modeOfActionHist)
  
  // value pair
  tumorModelAndCompoundBubbleChart
      .width(640)
      .height(480)
      .mouseZoomable(true)
      .dimension(tumorModelAndCompoundDim)
      .group(tumorModelAndCompoundReduction)
      .colors(cancerDataColors)
      .colorAccessor(function (p) {
        return(getCancerTypes(cancerData)
              .indexOf(p.value.cancerType))
       })
      .keyAccessor(function (p) {
         return p.value.avgX
       })
      .valueAccessor(function (p) {
         return p.value.avgY
       })
      .radiusValueAccessor(function (p) {
         return p.value.countX + p.value.countY
       })
  
      .y(d3.scale.linear().domain(d3.extent(cancerData, function(d){return d.y})))
      .elasticY(true)
      .yAxisPadding(5)
  
      .x(d3.scale.linear().domain(d3.extent(cancerData, function(d){return d.x})))
      .elasticX(true)
      .xAxisPadding(50)
  
      .r(d3.scale.linear().domain([0, 20]))
  
      .label(function (p) {
        return labeler(p.value.label, ', ')
       })
      .title(function (p) {
          return labeler(
           'Substance, Model: ' + labeler(p.value.label, ', ') + strSep() 
          + getDimensionName('x') + ': ' + p.value.avgX + ', '
          + getDimensionName('y') + ': ' + p.value.avgY  + strSep()
          + 'Count ('+ getDimensionName('x') + ' + ' + getDimensionName('y') + '): ' + (p.value.countX + p.value.countY)
        )
       })
  
      .renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
      .renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false

}

// init charts and data
var cancerTypeRingChart              = dc.pieChart("#cancer-type-chart")
var compoundRingChart                = dc.pieChart("#compound-chart")
var tumorModelAndCompoundHistChartX  = dc.barChart("#tumor-model-and-compound-hist-chart-x")
var tumorModelAndCompoundHistChartY  = dc.barChart("#tumor-model-and-compound-hist-chart-y")
var tumorModelAndCompoundBubbleChart = dc.bubbleChart("#tumor-model-and-compound-bubble-chart")

var cancerData = [
  {value: 40,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Cisplatin'      },
  {value: 38,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Cisplatin'      },
  {value: 35,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Vemurafenib'    },
  {value: 41,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: 'Cisplatin'      },
  {value: 38,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: 'Vemurafenib'    },
  {value: 62,  dim: 'x', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: '5-Fluorouracil' },
  {value: 110, dim: 'x', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Vemurafenib'    },
  {value: 120, dim: 'x', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Cisplatin'      },
  {value: 110, dim: 'x', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Cisplatin'      },
  {value: 200, dim: 'x', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: '5-Fluorouracil' },
  {value: 3,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Cisplatin'      },
  {value: 4,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Cisplatin'      },
  {value: 4,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF1', compound: 'Vemurafenib'    },
  {value: 3,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: 'Cisplatin'      },
  {value: 4,   dim: 'y', cancerType: 'MAXF', tumorModel: 'MAXF2', compound: '5-Fluorouracil' },
  {value: 8,   dim: 'y', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Vemurafenib'    },
  {value: 12,  dim: 'y', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: 'Cisplatin'      },
  {value: 11,  dim: 'y', cancerType: 'CXF',  tumorModel: 'CXF1',  compound: '5-Fluorouracil' },
];


var cancerData                     = addCountsForTumorModelAndCompound(cancerData)
console.log(cancerData)

var cancerFacts                    = crossfilter(cancerData)

// dimensions
var cancerTypeDim                  = cancerFacts.dimension(function(d) {return d.cancerType})
var compoundDim                    = cancerFacts.dimension(function(d) {return d.compound  })
var tumorModelAndCompoundDim       = cancerFacts.dimension(function(d) {return getTumorModelAndCompoundSelector(d)})

// reduce-count
var cancerTypeHist                 = cancerTypeDim                .group().reduceCount()
var compoundHist                   = compoundDim                  .group().reduceCount()

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

// histogram
var xlim = getTumorModelAndCompoundDimExtent(cancerData)
  console.log(xlim)
var xTicks = xlim[1]-xlim[0]+1
xlim[0]-=1
xlim[1]+=1

var yTicksX=d3.max(tumorModelAndCompoundReduction.all(), function(d) { return d.value.countX })
tumorModelAndCompoundHistChartX
    .centerBar(true)
    .gap(0.2)
    .brushOn(false)
    .renderHorizontalGridLines(true)
    .width(200).height(200)
    .dimension(tumorModelAndCompoundDim)
    .group(tumorModelAndCompoundReduction)
    .colors(d3.scale.linear().range(['#BBB','#DDD']))
    .keyAccessor(function(d) {
        console.log(d.value.label)
        console.log('key')
        console.log(d.value.tmcdCountX)
        console.log('value')
        console.log(d.value.countX)
        return(d.value.tmcdCountX)
     })
    .valueAccessor(function(d) {
        return(d.value.countX)
     })
    .x(d3.scale.linear().domain(xlim))
tumorModelAndCompoundHistChartX
    .xAxis().tickFormat(function(v) {return Math.round(v)})
    .tickSubdivide(0)
    .ticks(xTicks)
tumorModelAndCompoundHistChartX
    .yAxis().tickFormat(function(v) {return Math.round(v)})
    .tickSubdivide(0)
    .ticks(yTicksX)

var yTicksY=d3.max(tumorModelAndCompoundReduction.all(), function(d) { return d.value.countY })
tumorModelAndCompoundHistChartY
    .centerBar(true)
    .gap(0.2)
    .renderHorizontalGridLines(true)
    .width(200).height(200)
    .dimension(tumorModelAndCompoundDim)
    .group(tumorModelAndCompoundReduction)
    .colors(d3.scale.linear().range(['#BBB','#DDD']))
    .keyAccessor(function(d) {
        return(d.value.tmcdCountY)
     })
    .valueAccessor(function(d) {
        return(d.value.countY)
     })
    .x(d3.scale.linear().domain(xlim))
tumorModelAndCompoundHistChartY
    .xAxis().tickFormat(function(v) {return Math.round(v)})
    .tickSubdivide(0)
    .ticks(xTicks)
tumorModelAndCompoundHistChartY
    .yAxis().tickFormat(function(v) {return Math.round(v)})
    .tickSubdivide(0)
    .ticks(yTicksX)




// cancer type
cancerTypeRingChart
    .width(175).height(175)
    .dimension(cancerTypeDim)
    .group(cancerTypeHist)
    .innerRadius(0)
    .colors(d3.scale.category10())

// compound
compoundRingChart
    .width(175).height(175)
    .dimension(compoundDim)
    .group(compoundHist)
    .innerRadius(0)
    .colors(d3.scale.linear().range(['#BBB','#DDD']))

// value pair
tumorModelAndCompoundBubbleChart
    .width(640)
    .height(300)
    .mouseZoomable(true)
    .dimension(tumorModelAndCompoundDim)
    .group(tumorModelAndCompoundReduction)
    .colors(d3.scale.category10())
    .colorAccessor(function (p) {
      return getCancerTypeNumber(p.value.cancerType)
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
        + 'Count ('+ getDimensionName('x') + ' and ' + getDimensionName('y') + '): ' + (p.value.countX + p.value.countY)
      )
     })

    .renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
    .renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false

// init charts and data
var cancerTypeRingChart              = dc.pieChart("#cancer-type-chart")
var compoundRingChart                = dc.pieChart("#compound-chart")
var tumorModelAndCompoundHistChart   = dc.barChart("#tumor-model-and-compound-hist-chart")
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
var cancerFacts                    = crossfilter(cancerData)

// dimensions
var cancerTypeDim                  = cancerFacts.dimension(function(d) {return d.cancerType})
var compoundDim                    = cancerFacts.dimension(function(d) {return d.compound  })
var tumorModelAndCompoundDim       = cancerFacts.dimension(function(d) {return getTumorModelAndCompoundSelector(d)})
var tumorModelAndCompoundCountDim  = cancerFacts.dimension(function(d) {return d.tumorModelAndCompoundCount})

// reduce-count
var cancerTypeHist                 = cancerTypeDim                .group().reduceCount()
var compoundHist                   = compoundDim                  .group().reduceCount()
var tumorModelAndCompoundCountHist = tumorModelAndCompoundCountDim.group().reduceCount()

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
    p.label       = v.tumorModel + strSep() + v.compound 
    p.cancerType  = v.cancerType
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
    return({countX: 0, countY: 0, sumX: 0, avgX: 0, sumY: 0, avgY: 0, label: '',})
  }
)

// histogram
var xlim = getTumorModelAndCompoundExtent(cancerData)
var xTicks = xlim[1]-xlim[0]+1
xlim[0]-=1 // needed for brushing atm
xlim[1]+=1 // needed for brushing atm
var yTicks=d3.max(tumorModelAndCompoundCountHist.all(), getNormalizedHistValues)+1

tumorModelAndCompoundHistChart
    .centerBar(true) // not working
    .gap(0.1)        // not working
    .renderHorizontalGridLines(true)
    .width(200).height(200)
    .dimension(tumorModelAndCompoundCountDim)
    .group(tumorModelAndCompoundCountHist)
    .colors(d3.scale.linear().range(['#BBB','#DDD']))
    .valueAccessor(function(d) {return(d.value/d.key)}) // de-multiply
    .x(d3.scale.linear().domain(xlim))

tumorModelAndCompoundHistChart
    .xAxis().tickFormat(function(v) {return Math.round(v)})
    .tickSubdivide(0)
    .ticks(xTicks)
tumorModelAndCompoundHistChart
    .yAxis().tickFormat(function(v) {return Math.round(v)})
    .tickSubdivide(0)
    .ticks(yTicks)

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

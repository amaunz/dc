var strSep = function() {
  return '__AND__'
}

var labeler = function(lab, sep) {
  if (sep==undefined) sep="\n"
  return(lab.split(strSep()).join(sep))
}

var getCancerTypeNumber = function (cancerType) {
  if (cancerType == 'MAXF') return 0 
  if (cancerType == 'CXF')  return 1
}

var getDimensions = function() {
  return {
    x: 'Invitro',
    y: 'Invivo',
  }
}

var getDimensionName = function(which) {
  return getDimensions()[which]
}

var getTumorModelAndCompoundSelector = function(d) {
  return d.tumorModel + strSep() + d.compound
}

var getTumorModelAndCompoundAndDimSelector = function(d) {
  return d.tumorModel + strSep() + d.compound + strSep() + d.dim
}

var getTumorModelAndCompoundExtentX = function(cancerData) {
  return d3.extent(cancerData, function(d){return d.tmcdCountX})
}

var getTumorModelAndCompoundExtentY = function(cancerData) {
  return d3.extent(cancerData, function(d){return d.tmcdCountY})
}

var getTumorModelAndCompoundDimExtent = function(cancerData) {
  return d3.extent(getTumorModelAndCompoundExtentX(cancerData)
           .concat(getTumorModelAndCompoundExtentY(cancerData)))
}

// add counts for specified cols
var addCountsForTumorModelAndCompound = function(data) {
  var facts = crossfilter(data)
  var tumorModelAndCompoundDimDim = facts.dimension(function(d) {return getTumorModelAndCompoundAndDimSelector(d)})
  var tumorModelAndCompoundDimHist = tumorModelAndCompoundDimDim.group().reduceCount()
  var counts = tumorModelAndCompoundDimHist.all()
  counts.forEach(function(count) {
    var modelCompoundDimAry = count.key.split(strSep())
    data.forEach(function(d,i){
      if (d.tumorModel == modelCompoundDimAry[0] && d.compound == modelCompoundDimAry[1]) {
        if (modelCompoundDimAry[2] == 'x')
          d.tmcdCountX = count.value
        if (modelCompoundDimAry[2] == 'y')
          d.tmcdCountY = count.value
        if (d.tmcdCountX == undefined)
          d.tmcdCountX = 0
        if (d.tmcdCountY == undefined)
          d.tmcdCountY = 0
      }
    })
  })
  return data
}

// Colors see http://goo.gl/xUNT0a

var cancerDataColors = 
["#FFE500", "#BFB130", "#A69500", "#FFEC40", "#FFF173", 
 "#00B25C", "#218555", "#00733C", "#36D88A", "#61D89F",
 "#FF4100", "#BF5430", "#A62A00", "#FF7140", "#FF9773"]

d3.unique = function(array) {
  return d3.scale.ordinal().domain(array).domain();
}

var getCancerTypes = function(cancerData) {
  return d3.unique(cancerData.map(function(d) {return d.cancerType}))
}

var getModesOfAction = function(cancerData) {
  return d3.unique(cancerData.map(function(d) {return d.modeOfAction}))
}

colorizeAccToCancerTypes = function() {
  tumorModelAndCompoundBubbleChart.colorAccessor(
      function(p){
        return(getCancerTypes(cancerData)
              .indexOf(p.value.cancerType))
      })
  tumorModelAndCompoundBubbleChart.redraw()
  cancerTypeRingChart.colors(cancerDataColors)
  cancerTypeRingChart.redraw()
  modeOfActionRingChart.colors(d3.scale.category20c())
  modeOfActionRingChart.redraw()
}

colorizeAccToModesOfAction = function() {
  tumorModelAndCompoundBubbleChart.colorAccessor(
      function(p){
        return(getModesOfAction(cancerData)
              .indexOf(p.value.modeOfAction))
      })
  tumorModelAndCompoundBubbleChart.redraw()
  modeOfActionRingChart.colors(cancerDataColors)
  modeOfActionRingChart.redraw()
  cancerTypeRingChart.colors(d3.scale.category20c())
  cancerTypeRingChart.redraw()
}


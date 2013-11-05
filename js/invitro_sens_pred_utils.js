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

var getTumorModelAndCompoundAndCountSelector = function(d) {
  return d.tumorModel + strSep() + d.compound + strSep() + d.tumorModelAndCompoundCount
}

var getTumorModelAndCompoundExtent = function(cancerData) {
  return d3.extent(cancerData, function(d){return d.tumorModelAndCompoundCount})
}

var getNormalizedHistValues = function(d) {
  return d.value/d.key
}

// add counts for specified cols
var addCountsForTumorModelAndCompound = function(data) {
  var facts = crossfilter(data)
  var tumorModelAndCompoundDim = facts.dimension(function(d) {return getTumorModelAndCompoundSelector(d)})
  var tumorModelAndCompoundHist = tumorModelAndCompoundDim.group().reduceCount()
  var counts = tumorModelAndCompoundHist.all()
  counts.forEach(function(count) {
    var modelCompoundAry = count.key.split(strSep())
    data.forEach(function(d,i){
      if (d.tumorModel == modelCompoundAry[0] && d.compound == modelCompoundAry[1]) 
        d.tumorModelAndCompoundCount = count.value
    })
  })
  return data
}

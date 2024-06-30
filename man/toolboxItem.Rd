% Auto-generated: do not edit by hand
\name{toolboxItem}

\alias{toolboxItem}

\title{ToolboxItem component}

\description{
ToolboxItem is a wrapper that is intended to be used with ToolBoxGrid. ToolboxItem specify the position and size of the item on the dashboard and if it is in the toolbox.
}

\usage{
toolboxItem(children=NULL, id=NULL, defaultName=NULL, h=NULL, w=NULL,
x=NULL, y=NULL)
}

\arguments{
\item{children}{List of a list of or a singular dash component, string or numbers | a list of or a singular dash component, string or number. The child or list of children wrapped by the component.}

\item{id}{Character | named list. The ID used to identify this component in Dash callbacks.}

\item{defaultName}{Character. The name which will be displayed if the Item is in the toolbox. If non provided, then default is the ID}

\item{h}{Numeric | named list. The height on the of y axis (default is 4)}

\item{w}{Numeric | named list. The width of the x axis (default is 6).}

\item{x}{Numeric | named list. The position on the x axis in number of columns (by default, the  max is 12).}

\item{y}{Numeric | named list. The position on the y axis (the unit is 30px, by default)}
}

\value{named list of JSON elements corresponding to React.js properties and their values}


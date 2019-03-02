# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.0.4] - 2019-03-02

### Added

-   Flow typings
-   Common lint/test/bundle config dependency

## [0.0.3] - 2019-03-02

### Added

-   Link to presentation

## [0.0.2] - 2018-07-23

### Added

-   _assign_ operator to merge all props in stream (for testing purposes)
-   _prev_ operator to shift stream one step back (for business cases)

## 0.0.1 - 2018-07-20

### Added

-   _\@reactive_ decorator to replace life cycle with _RxJS_
-   _handle_ high order operator to define _reactive_ upstream and map it to component props
-   _par_ high order operator to combine operators in parallel (forking input and joining outputs)
-   Unit tests
-   Documentation
-   _Travis CI_ integration
-   _Coveralls_ integration

[unreleased]: https://github.com/redneckz/react-rxjs/compare/v0.0.4...HEAD
[0.0.4]: https://github.com/redneckz/react-rxjs/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/redneckz/react-rxjs/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/redneckz/react-rxjs/compare/v0.0.1...v0.0.2

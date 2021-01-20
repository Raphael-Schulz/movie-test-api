import { Movie, MovieModel } from "../models";

export async function movies(_: void, _args: any): Promise<Array<Movie>> {
  if (_args.selectedSortField && _args.direction)
    return MovieModel.find().sort({
      [_args.selectedSortField]: _args.direction,
    });
  else return MovieModel.find();
}

export async function addMovie(_: void, _args: any): Promise<Movie | null> {
  const { name, release, duration, actors } = _args;

  const existingMovie: number = await MovieModel.countDocuments({ name });
  if (existingMovie) {
    throw new Error("Movie already exists!");
  }

  const newMovie: Movie = new MovieModel({
    name,
    release,
    duration,
    actors,
  });

  return newMovie.save();
}

export async function updateMovie(_: void, _args: any): Promise<Movie | null> {
  const { _id, name, release, duration, actors } = _args;

  let movie = null;

  const existingMovie: number = await MovieModel.countDocuments({
    name: name,
    _id: { $ne: _id },
  });
  if (existingMovie) {
    throw new Error("Movie already exists!");
  }

  movie = await MovieModel.findByIdAndUpdate(
    { _id: _id },
    {
      name,
      release,
      duration,
      actors,
    },
    { new: true },
    (error) => {
      if (error) throw new Error("An Error occurred while updating a movie!");
    },
  );

  return movie;
}

export async function deleteMovie(_: void, _args: any): Promise<Boolean> {
  const { _id } = _args;

  if ((await MovieModel.deleteOne({ _id: _id })).deletedCount) return true;
  else throw new Error("An Error occurred while deleting a movie!");
}

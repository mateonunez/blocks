import { FolderBlockProps } from "@githubnext/blocks";
import {
  create,
  insertBatch,
  Lyra,
  ResolveSchema,
  RetrievedDoc,
  search,
} from "@lyrasearch/lyra";
import { Box, Text, TextInput } from "@primer/react";
import { SearchIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import schemaResolver from "lyra-schema-resolver";

export default function (props: FolderBlockProps) {
  const [db, setDb] = useState({});
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any>([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
    )
      .then((response) => response.json())
      .then((result) => {
        const pokedex = result.map((pokemon: any) => ({
          name: pokemon.name.english,
          type: pokemon.type,
          base: pokemon.base,
        }));

        const resolvedSchema = schemaResolver(pokedex[0], { strict: false });
        setSchema(resolvedSchema);
        create({
          schema: resolvedSchema,
        }).then((db) => {
          setDb(db);
          insertBatch(db, pokedex).then(() => {
            setLoading(false);
          });
        });
      });
  }, []);

  const handleSearch = async (term: string) => {
    setTerm(term);
    setLoading(true);

    const results = await search(db as Lyra<ResolveSchema<typeof schema>>, {
      term,
    });

    setResults(results.hits);
    setLoading(false);
  };

  return (
    <Box p={4}>
      <h1>Lyra implementation on GitHub Blocks!</h1>

      {/* Description */}
      <Box mb={3}>
        <Text>
          Search for a Pokemon. This example uses{" "}
          <a href="https://lyrajs.io/" target="_blank">
            Lyra
          </a>
          .
        </Text>
      </Box>

      {/* Search */}
      <Box mb={3}>
        <TextInput
          loaderPosition="trailing"
          leadingVisual={SearchIcon}
          trailingVisual={SearchIcon}
          loading={loading}
          placeholder="Search for a Pokemon..."
          value={term}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Box>

      {/* Results */}
      {results && results.length > 0 && (
        <Box mb={3}>
          <Text fontWeight="bold" fontSize={2}>
            Results{" "}
          </Text>
          <Text fontStyle="italic">
            ({results.length} {results.length === 1 ? "result" : "results"})
          </Text>
          {/* Term */}
          <Box mb={3}>
            <Text fontWeight="bold" fontSize={1}>
              Term:{" "}
            </Text>
            <Text>{term}</Text>
          </Box>
          {/* Results */}
          <Box>
            {results.map((result: any) => (
              <Box m={3} key={result.document.name}>
                <Box>
                  <Text fontWeight="bold" fontSize={1}>
                    Name:{" "}
                  </Text>
                  <Text>{result.document.name}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize={1}>
                    Type:{" "}
                  </Text>
                  <Text>{result.document.type.join(", ")}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize={1}>
                    Base:{" "}
                  </Text>
                  <Text>{JSON.stringify(result.document.base, null, 2)}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

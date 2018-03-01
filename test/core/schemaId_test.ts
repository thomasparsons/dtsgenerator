import assert from 'power-assert';
import SchemaId from '../../src/core/schemaId';

describe('schema id parser test', () => {

    function test(schemaId: SchemaId, expectedId: string, isFetchable: boolean, fileId: string,
                  isJsonPath: boolean, jsonPath: string, typeNames: string[]): void {
        assert.equal(schemaId.getAbsoluteId(), expectedId);
        assert.equal(schemaId.isFetchable(), isFetchable);
        assert.equal(schemaId.getFileId(), fileId);
        assert.equal(schemaId.existsJsonPointerHash(), isJsonPath);
        assert.deepEqual(schemaId.getJsonPointerHash(), jsonPath);
        assert.deepEqual(schemaId.getTypeNames(), typeNames);
    }

    it('root schema id', () => {
        test(new SchemaId('/sampleId', []), '/sampleId#', false, '/sampleId#', false, '#', ['SampleId']);
        test(new SchemaId('/sample2/path/file', []), '/sample2/path/file#', false, '/sample2/path/file#', false, '#', ['Sample2', 'Path', 'File']);
        test(new SchemaId('https://example.com:3000/path/to/schema/file', []),
             'https://example.com:3000/path/to/schema/file#', true, 'https://example.com:3000/path/to/schema/file#', false, '#',
             ['ExampleCom3000', 'Path', 'To', 'Schema', 'File']);
        test(new SchemaId('#/definitions/positiveInteger', []), '#/definitions/positiveInteger', false, '#', true, '#/definitions/positiveInteger', ['Definitions', 'PositiveInteger']);
    });
    it('JSON Schema usage pattern', () => {
        test(new SchemaId('http://x.y.z/rootschema.json#', []), 'http://x.y.z/rootschema.json#', true, 'http://x.y.z/rootschema.json#', false, '#', ['XYZ', 'RootschemaJson']);
        test(new SchemaId('#foo', ['http://x.y.z/rootschema.json#']), 'http://x.y.z/rootschema.json#foo', true, 'http://x.y.z/rootschema.json#', false, '#', ['XYZ', 'RootschemaJson', 'Foo']);
        test(new SchemaId('otherschema.json', ['http://x.y.z/rootschema.json#']), 'http://x.y.z/otherschema.json#', true, 'http://x.y.z/otherschema.json#', false, '#', ['XYZ', 'OtherschemaJson']);
        test(new SchemaId('#bar', ['otherschema.json', 'http://x.y.z/rootschema.json#']), 'http://x.y.z/otherschema.json#bar', true, 'http://x.y.z/otherschema.json#', false, '#', ['XYZ', 'OtherschemaJson', 'Bar']);
        test(new SchemaId('t/inner.json#/json/path', ['otherschema.json', 'http://x.y.z/rootschema.json#']), 'http://x.y.z/t/inner.json#/json/path', true, 'http://x.y.z/t/inner.json#', true, '#/json/path', ['XYZ', 'T', 'InnerJson', 'Json', 'Path']);
        test(new SchemaId('some://where.else/completely#', ['http://x.y.z/rootschema.json#']), 'some://where.else/completely#', false, 'some://where.else/completely#', false, '#', ['WhereElse', 'Completely']);
    });
    it('JSON Schema Draft-07 example pattern', () => {
        test(new SchemaId('#foo', ['http://example.com/root.json']), 'http://example.com/root.json#foo', true, 'http://example.com/root.json#', false, '#', ['ExampleCom', 'RootJson', 'Foo']);
        test(new SchemaId('other.json', ['http://example.com/root.json']), 'http://example.com/other.json#', true, 'http://example.com/other.json#', false, '#', ['ExampleCom', 'OtherJson']);
        test(new SchemaId('#bar', ['other.json', 'http://example.com/root.json']), 'http://example.com/other.json#bar', true, 'http://example.com/other.json#', false, '#', ['ExampleCom', 'OtherJson', 'Bar']);
        test(new SchemaId('t/inner.json', ['other.json', 'http://example.com/root.json']), 'http://example.com/t/inner.json#', true, 'http://example.com/t/inner.json#', false, '#', ['ExampleCom', 'T', 'InnerJson']);
    });

});


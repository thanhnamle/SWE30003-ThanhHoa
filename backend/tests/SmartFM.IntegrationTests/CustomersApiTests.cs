using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.API.Controllers;
using SmartFM.Domain.Entities;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for Customers API controller (/api/customers).
/// </summary>
public class CustomersApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public CustomersApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCustomers_ShouldReturn_200OK_WithSeededList()
    {
        var response = await _client.GetAsync("/api/customers");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var customers = await response.Content.ReadFromJsonAsync<List<Customer>>();
        customers.Should().NotBeNull();
        customers.Should().NotBeEmpty();
    }

    [Fact]
    public async Task GetCustomerById_Exists_ShouldReturn_200OK()
    {
        var response = await _client.GetAsync($"/api/customers/{TestDataSeeder.CustomerId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var customer = await response.Content.ReadFromJsonAsync<Customer>();
        customer.Should().NotBeNull();
        customer!.Id.Should().Be(TestDataSeeder.CustomerId);
    }

    [Fact]
    public async Task GetCustomerById_NotExists_ShouldReturn_404NotFound()
    {
        var response = await _client.GetAsync($"/api/customers/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateCustomer_ValidData_ShouldReturn_201Created()
    {
        var request = new CreateCustomerRequest("Acme Logistics", "Acme Corp", "contact@acme.com", "+84901234567", true);

        var response = await _client.PostAsJsonAsync("/api/customers", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var customer = await response.Content.ReadFromJsonAsync<Customer>();
        customer.Should().NotBeNull();
        customer!.Name.Should().Be("Acme Logistics");
        customer.CompanyName.Should().Be("Acme Corp");
    }

    [Fact]
    public async Task UpdateCustomer_Exists_ShouldReturn_200OK()
    {
        var createRequest = new CreateCustomerRequest("Original Name", "Original Co", "orig@test.com", "0900000000", false);
        var createResp = await _client.PostAsJsonAsync("/api/customers", createRequest);
        var createdCustomer = await createResp.Content.ReadFromJsonAsync<Customer>();

        var updateRequest = new UpdateCustomerRequest("Updated Name", "Updated Co", "updated@test.com", "0911111111", true);
        var response = await _client.PutAsJsonAsync($"/api/customers/{createdCustomer!.Id}", updateRequest);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updatedCustomer = await response.Content.ReadFromJsonAsync<Customer>();
        updatedCustomer.Should().NotBeNull();
        updatedCustomer!.Name.Should().Be("Updated Name");
        updatedCustomer.IsCorporateAccount.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteCustomer_Exists_ShouldReturn_204NoContent()
    {
        var createRequest = new CreateCustomerRequest("Temp Customer", "Temp Co", "temp@test.com", "0922222222", false);
        var createResp = await _client.PostAsJsonAsync("/api/customers", createRequest);
        var createdCustomer = await createResp.Content.ReadFromJsonAsync<Customer>();

        var response = await _client.DeleteAsync($"/api/customers/{createdCustomer!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var getResp = await _client.GetAsync($"/api/customers/{createdCustomer.Id}");
        getResp.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}
